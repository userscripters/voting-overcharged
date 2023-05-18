// ==UserScript==
// @name           Voting Overcharged
// @author         Oleg Valter <oleg.a.valter@gmail.com>
// @description    A userscript for automatically voting on posts depending on various conditions
// @grant          unsafeWindow
// @grant          GM_getValue
// @grant          GM_setValue
// @homepage       https://github.com/userscripters/voting-overcharged#readme
// @match          https://stackoverflow.com/questions/*
// @match          https://serverfault.com/questions/*
// @match          https://superuser.com/questions/*
// @match          https://*.stackexchange.com/questions/*
// @match          https://askubuntu.com/questions/*
// @match          https://stackapps.com/questions/*
// @match          https://mathoverflow.net/questions/*
// @match          https://pt.stackoverflow.com/questions/*
// @match          https://ja.stackoverflow.com/questions/*
// @match          https://ru.stackoverflow.com/questions/*
// @match          https://es.stackoverflow.com/questions/*
// @match          https://meta.stackoverflow.com/questions/*
// @match          https://meta.serverfault.com/questions/*
// @match          https://meta.superuser.com/questions/*
// @match          https://meta.askubuntu.com/questions/*
// @match          https://meta.mathoverflow.net/questions/*
// @match          https://pt.meta.stackoverflow.com/questions/*
// @match          https://ja.meta.stackoverflow.com/questions/*
// @match          https://ru.meta.stackoverflow.com/questions/*
// @match          https://es.meta.stackoverflow.com/questions/*
// @namespace      userscripters
// @require        https://raw.githubusercontent.com/userscripters/storage/master/dist/browser.js
// @run-at         document-start
// @source         git+https://github.com/userscripters/voting-overcharged.git
// @supportURL     https://github.com/userscripters/voting-overcharged/issues
// @version        1.2.0
// ==/UserScript==

"use strict";
const scriptName = "voting-overcharged";
const initScriptConfiguration = () => {
    var _a, _b;
    const { Configurer } = ((_a = unsafeWindow.UserScripters) === null || _a === void 0 ? void 0 : _a.Userscripts) || {};
    if (!Configurer) {
        console.debug(`[${scriptName}] missing userscript configurer`);
        return;
    }
    const script = Configurer.register(scriptName, (_b = window.Store) === null || _b === void 0 ? void 0 : _b.locateStorage());
    const commonConfig = {
        def: false,
        direction: "left",
        type: "toggle",
    };
    script.options({
        "downvote-on-close": {
            def: false,
            desc: "Auto downvote question upon voting to close",
        },
        "upvote-on-accept": {
            def: true,
            desc: "Auto upvote question upon accepting",
        },
        "upvote-q-on-upvote-a": {
            def: false,
            desc: "Auto upvote question upon upvoting an answer",
        },
        "downvote-q-on-downvote-a": {
            def: false,
            desc: "Auto downvote question upon downvoting an answer",
        },
    }, commonConfig);
    return script;
};
const loadConfigOption = async (name, def) => {
    var _a;
    const { Configurer } = ((_a = unsafeWindow.UserScripters) === null || _a === void 0 ? void 0 : _a.Userscripts) || {};
    const script = Configurer === null || Configurer === void 0 ? void 0 : Configurer.get(scriptName);
    return script ? script.load(name, def) : def;
};
const getPostVoteURL = (postId, voteTypeId) => {
    return new URL(`${location.origin}/posts/${postId}/vote/${voteTypeId}`);
};
const voteOnPost = async (postId, voteTypeId) => {
    try {
        const voteURL = getPostVoteURL(postId, voteTypeId);
        const body = new FormData();
        body.set("fkey", StackExchange.options.user.fkey);
        const res = await fetch(voteURL, { method: "POST", body });
        const { Message, Success } = await res.json();
        if (!Success) {
            console.debug(`[${scriptName}] error when voting on post #${postId}`, Message);
        }
        return Success;
    }
    catch (error) {
        console.debug(`[${scriptName}] failed to vote on post #${postId}`, error);
        return false;
    }
};
const handleAutovote = async (voteTypeId, url, xhr) => {
    const { Message, Success } = xhr.responseJSON;
    if (!Success) {
        console.debug(`[${scriptName}] vote was unsuccessful`, Message);
        return false;
    }
    const [_, postId] = /\/(?:posts|questions)\/(\d+)\//.exec(url.toString()) || [];
    if (Number.isNaN(+postId)) {
        console.debug(`[${scriptName}] invalid post id: ${postId}`);
        return false;
    }
    return voteOnPost(postId, voteTypeId);
};
const handleVoteComplete = async (voteTypeId, postType, url, xhr) => {
    const { voteTypeIds } = StackExchange.vote;
    const upvoteOnAccept = await loadConfigOption("upvote-on-accept", true);
    const downvoteOnClose = await loadConfigOption("downvote-on-close", false);
    const upvoteQOnUpvoteA = await loadConfigOption("upvote-q-on-upvote-a", false);
    const downvoteQOnDownvoteA = await loadConfigOption("downvote-q-on-downvote-a", false);
    const handlerPromises = [];
    const isAnswerVote = postType === "answer";
    const questionId = StackExchange.question.getQuestionId();
    const questionUpvoteURL = getPostVoteURL(questionId, voteTypeIds.upMod);
    const questionDownvoteURL = getPostVoteURL(questionId, voteTypeIds.downMod);
    if (isAnswerVote &&
        upvoteOnAccept &&
        voteTypeId === voteTypeIds.acceptedByOwner) {
        handlerPromises.push(handleAutovote(voteTypeIds.upMod, url, xhr));
    }
    if (isAnswerVote && upvoteQOnUpvoteA && voteTypeId === voteTypeIds.upMod) {
        handlerPromises.push(handleAutovote(voteTypeIds.upMod, questionUpvoteURL, xhr));
    }
    if (isAnswerVote &&
        downvoteQOnDownvoteA &&
        voteTypeId === voteTypeIds.downMod) {
        handlerPromises.push(handleAutovote(voteTypeIds.downMod, questionDownvoteURL, xhr));
    }
    const isVTC = voteTypeId === voteTypeIds.close || /\/close\/add/.test(url);
    if (downvoteOnClose && isVTC) {
        handlerPromises.push(handleAutovote(voteTypeIds.downMod, questionDownvoteURL, xhr));
    }
    const status = await Promise.all(handlerPromises);
    if (!status) {
        StackExchange.helpers.showToast("Something went wrong during autovote", { type: "danger" });
    }
};
window.addEventListener("load", async () => {
    StackExchange === null || StackExchange === void 0 ? void 0 : StackExchange.ready(() => {
        initScriptConfiguration();
        const voteTypeRegExp = /\/posts\/(\d+)\/vote\/(\d+)/;
        $(document).ajaxComplete((_event, xhr, options) => {
            const { url } = options;
            if (!url) {
                console.debug(`[${scriptName}] missing URL: ${url}`);
                return;
            }
            const [, postId, voteTypeId] = voteTypeRegExp.exec(url) || [];
            const postType = StackExchange.question.getQuestionId() === +postId
                ? "question"
                : "answer";
            handleVoteComplete(+voteTypeId, postType, url, xhr);
        });
    });
}, { once: true });
