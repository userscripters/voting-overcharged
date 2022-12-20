// ==UserScript==
// @name           Voting Overcharged
// @author         Oleg Valter <oleg.a.valter@gmail.com>
// @description    A userscript for automatically voting on posts depending on various conditions
// @grant          none
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
// @run-at         document-start
// @source         git+https://github.com/userscripters/voting-overcharged.git
// @supportURL     https://github.com/userscripters/voting-overcharged/issues
// @version        1.0.0
// ==/UserScript==

"use strict";
const scriptName = "voting-overcharged";
const voteOnPost = async (postId, voteTypeId) => {
    try {
        const voteURL = new URL(`${location.origin}/posts/${postId}/vote/${voteTypeId}`);
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
        console.debug(`[${scriptName}] accept vote was unsuccessful`, Message);
        return false;
    }
    const [_, postId] = /\/posts\/(\d+)\//.exec(url) || [];
    if (Number.isNaN(+postId)) {
        console.debug(`[${scriptName}] invalid post id: ${postId}`);
        return false;
    }
    return voteOnPost(postId, voteTypeId);
};
window.addEventListener("load", async () => {
    StackExchange === null || StackExchange === void 0 ? void 0 : StackExchange.ready(() => {
        const { acceptedByOwner, upMod } = StackExchange.vote.voteTypeIds;
        const acceptVoteRegExp = new RegExp(`\\/posts\\/\\d+\/vote\\/${acceptedByOwner}`);
        $(document).ajaxComplete((_event, xhr, options) => {
            const { url } = options;
            if (!url || !acceptVoteRegExp.test(url)) {
                console.debug(`[${scriptName}] URL not matched: ${url}`);
                return;
            }
            handleAutovote(upMod, url, xhr).then((status) => {
                if (!status) {
                    StackExchange.helpers.showToast("Something went wrong during autovote", { type: "danger" });
                }
            });
        });
    });
}, { once: true });
