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
    // https://regex101.com/r/NX7PMb/1
    const [_, postId] = /\/posts\/(\d+)\//.exec(url) || [];

    if (Number.isNaN(+postId)) {
        console.debug(`[${scriptName}] invalid post id: ${postId}`);
        return false;
    }

    return voteOnPost(postId, voteTypeId);
};

window.addEventListener(
    "load",
    async () => {
        StackExchange?.ready(() => {
            const { acceptedByOwner, upMod } = StackExchange.vote.voteTypeIds;

            // https://regex101.com/r/8KyhyR/1
            const acceptVoteRegExp = new RegExp(
                `\\/posts\\/\\d+\/vote\\/${acceptedByOwner}`
            );

            $(document).ajaxComplete((_event, xhr, options) => {
                const { url } = options;

                if (!url || !acceptVoteRegExp.test(url)) {
                    console.debug(`[${scriptName}] URL not matched: ${url}`);
                    return;
                }

                handleAutovote(upMod, url, xhr).then((status) => {
                    if (!status) {
                        StackExchange.helpers.showToast(
                            "Something went wrong during autovote",
                            { type: "danger" }
                        );
                    }
                });
            });
        });
    },
    { once: true }
);
