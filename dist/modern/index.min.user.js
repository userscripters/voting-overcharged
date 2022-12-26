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
// @version        1.1.0
// ==/UserScript==

"use strict";const scriptName="voting-overcharged",initScriptConfiguration=()=>{var e=((null==(e=unsafeWindow.UserScripters)?void 0:e.Userscripts)||{})["Configurer"];if(e)return(e=e.register(scriptName,null==(e=window.Store)?void 0:e.locateStorage())).options({"downvote-on-close":{def:!1,desc:"Auto downvote when voting to close"},"upvote-on-accept":{def:!0,desc:"Auto upvote upon accepting"}},{def:!1,direction:"left",type:"toggle"}),e;console.debug(`[${scriptName}] missing userscript configurer`)},loadConfigOption=async(e,o)=>{var t=((null==(t=unsafeWindow.UserScripters)?void 0:t.Userscripts)||{})["Configurer"],t=null==t?void 0:t.get(scriptName);return t?t.load(e,o):o},voteOnPost=async(o,e)=>{try{var t=new URL(location.origin+`/posts/${o}/vote/`+e),n=new FormData;n.set("fkey",StackExchange.options.user.fkey);var{Message:s,Success:a}=await(await fetch(t,{method:"POST",body:n})).json();return a||console.debug(`[${scriptName}] error when voting on post #`+o,s),a}catch(e){return console.debug(`[${scriptName}] failed to vote on post #`+o,e),!1}},handleAutovote=async(e,o,t)=>{var n,{Message:t,Success:s}=t.responseJSON;return s?([n,s]=/\/(?:posts|questions)\/(\d+)\//.exec(o)||[],Number.isNaN(+s)?(console.debug(`[${scriptName}] invalid post id: `+s),!1):voteOnPost(s,e)):(console.debug(`[${scriptName}] accept vote was unsuccessful`,t),!1)},handleVoteComplete=async(e,o,t)=>{var n=StackExchange.vote["voteTypeIds"],s=await loadConfigOption("upvote-on-accept",!0),a=await loadConfigOption("downvote-on-close",!1),c=[],s=(s&&e===n.acceptedByOwner&&c.push(handleAutovote(n.upMod,o,t)),e===n.close||/\/close\/add/.test(o)),e=(a&&s&&c.push(handleAutovote(n.downMod,o,t)),await Promise.all(c));e||StackExchange.helpers.showToast("Something went wrong during autovote",{type:"danger"})};window.addEventListener("load",async()=>{null!==StackExchange&&void 0!==StackExchange&&StackExchange.ready(()=>{initScriptConfiguration();const s=/\/posts\/\d+\/vote\/(\d+)/;$(document).ajaxComplete((e,o,t)=>{var n,t=t["url"];t?([,n]=s.exec(t)||[],handleVoteComplete(+n,t,o)):console.debug(`[${scriptName}] missing URL: `+t)})})},{once:!0});