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

"use strict";const scriptName="voting-overcharged",voteOnPost=async(t,e)=>{try{var o=new URL(location.origin+`/posts/${t}/vote/`+e),s=new FormData;s.set("fkey",StackExchange.options.user.fkey);var{Message:a,Success:n}=await(await fetch(o,{method:"POST",body:s})).json();return n||console.debug(`[${scriptName}] error when voting on post #`+t,a),n}catch(e){return console.debug(`[${scriptName}] failed to vote on post #`+t,e),!1}},handleAutovote=async(e,t,o)=>{var s,{Message:o,Success:a}=o.responseJSON;return a?([s,a]=/\/posts\/(\d+)\//.exec(t)||[],Number.isNaN(+a)?(console.debug(`[${scriptName}] invalid post id: `+a),!1):voteOnPost(a,e)):(console.debug(`[${scriptName}] accept vote was unsuccessful`,o),!1)};window.addEventListener("load",async()=>{null!==StackExchange&&void 0!==StackExchange&&StackExchange.ready(()=>{const{acceptedByOwner:e,upMod:s}=StackExchange.vote.voteTypeIds,a=new RegExp("\\/posts\\/\\d+/vote\\/"+e);$(document).ajaxComplete((e,t,o)=>{o=o.url;o&&a.test(o)?handleAutovote(s,o,t).then(e=>{e||StackExchange.helpers.showToast("Something went wrong during autovote",{type:"danger"})}):console.debug(`[${scriptName}] URL not matched: `+o)})})},{once:!0});