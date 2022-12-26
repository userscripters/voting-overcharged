interface PostVoteResponse {
    CanOverrideMessageWithResearchPrompt: boolean;
    HasAcceptedByModRights: boolean;
    Info: boolean;
    Message: string;
    NewScore: number;
    Reason: number;
    Refresh: boolean;
    Success: boolean;
    Transient: boolean;
    Warning: boolean;
}

const scriptName = "voting-overcharged";

/**
 * @summary initializes userscript configuration
 */
const initScriptConfiguration = ():
    | UserScripters.Userscript<UserScripters.AsyncStorage>
    | undefined => {
    const { Configurer } = unsafeWindow.UserScripters?.Userscripts || {};
    if (!Configurer) {
        console.debug(`[${scriptName}] missing userscript configurer`);
        return;
    }

    const script = Configurer.register(
        scriptName,
        window.Store?.locateStorage()
    );

    const commonConfig: Omit<
        UserScripters.UserscriptToggleOption,
        "desc" | "name"
    > = {
        def: false,
        direction: "left",
        type: "toggle",
    };

    script.options(
        {
            "downvote-on-close": {
                def: false,
                desc: "Auto downvote when voting to close",
            },
            "upvote-on-accept": {
                def: true,
                desc: "Auto upvote upon accepting",
            },
        },
        commonConfig
    );

    return script;
};

/**
 * @summary loads a configuration option
 * @param name option name
 * @param def default value
 */
const loadConfigOption = async <T>(name: string, def: T) => {
    const { Configurer } = unsafeWindow.UserScripters?.Userscripts || {};
    const script = Configurer?.get(scriptName);
    return script ? script.load(name, def) : def;
};

const voteOnPost = async (
    postId: number | string,
    voteTypeId: StackExchange.VoteTypeId
) => {
    try {
        const voteURL = new URL(
            `${location.origin}/posts/${postId}/vote/${voteTypeId}`
        );

        const body = new FormData();
        body.set("fkey", StackExchange.options.user.fkey);

        const res = await fetch(voteURL, { method: "POST", body });

        const { Message, Success }: PostVoteResponse = await res.json();

        if (!Success) {
            console.debug(
                `[${scriptName}] error when voting on post #${postId}`,
                Message
            );
        }

        return Success;
    } catch (error) {
        console.debug(
            `[${scriptName}] failed to vote on post #${postId}`,
            error
        );
        return false;
    }
};

/**
 * @summary sends an auto vote
 * @param voteTypeId id of the vote
 * @param url URL of the voting endpoint
 * @param xhr a {@link JQuery.jqXHR} object
 */
const handleAutovote = async (
    voteTypeId: StackExchange.VoteTypeId,
    url: string,
    xhr: JQuery.jqXHR
) => {
    const { Message, Success } = xhr.responseJSON as PostVoteResponse;

    if (!Success) {
        console.debug(`[${scriptName}] accept vote was unsuccessful`, Message);
        return false;
    }
    // https://regex101.com/r/NX7PMb/2
    const [_, postId] = /\/(?:posts|questions)\/(\d+)\//.exec(url) || [];

    if (Number.isNaN(+postId)) {
        console.debug(`[${scriptName}] invalid post id: ${postId}`);
        return false;
    }

    return voteOnPost(postId, voteTypeId);
};

/**
 * @summary handles AJAX voting requests
 * @param voteTypeId id of the vote
 * @param url URL of the voting endpoint
 * @param xhr a {@link JQuery.jqXHR} object
 */
const handleVoteComplete = async (
    voteTypeId: StackExchange.VoteTypeId,
    url: string,
    xhr: JQuery.jqXHR
) => {
    const { voteTypeIds } = StackExchange.vote;

    const upvoteOnAccept = await loadConfigOption("upvote-on-accept", true);
    const downvoteOnClose = await loadConfigOption("downvote-on-close", false);

    const handlerPromises: Promise<boolean>[] = [];

    if (upvoteOnAccept && voteTypeId === voteTypeIds.acceptedByOwner) {
        handlerPromises.push(handleAutovote(voteTypeIds.upMod, url, xhr));
    }

    const isVTC = voteTypeId === voteTypeIds.close || /\/close\/add/.test(url);

    if (downvoteOnClose && isVTC) {
        handlerPromises.push(handleAutovote(voteTypeIds.downMod, url, xhr));
    }

    const status = await Promise.all(handlerPromises);

    if (!status) {
        StackExchange.helpers.showToast(
            "Something went wrong during autovote",
            { type: "danger" }
        );
    }
};

window.addEventListener(
    "load",
    async () => {
        StackExchange?.ready(() => {
            initScriptConfiguration();

            // https://regex101.com/r/8KyhyR/2
            const voteTypeRegExp = /\/posts\/\d+\/vote\/(\d+)/;

            $(document).ajaxComplete((_event, xhr, options) => {
                const { url } = options;

                if (!url) {
                    console.debug(`[${scriptName}] missing URL: ${url}`);
                    return;
                }

                const [, voteTypeId] = voteTypeRegExp.exec(url) || [];

                handleVoteComplete(+voteTypeId, url, xhr);
            });
        });
    },
    { once: true }
);
