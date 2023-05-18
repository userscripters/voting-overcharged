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

"use strict";const scriptName="voting-overcharged",initScriptConfiguration=()=>{var o=((null==(o=unsafeWindow.UserScripters)?void 0:o.Userscripts)||{})["Configurer"];if(o)return(o=o.register(scriptName,null==(o=window.Store)?void 0:o.locateStorage())).options({"downvote-on-close":{def:!1,desc:"Auto downvote question upon voting to close"},"upvote-on-accept":{def:!0,desc:"Auto upvote question upon accepting"},"upvote-q-on-upvote-a":{def:!1,desc:"Auto upvote question upon upvoting an answer"},"downvote-q-on-downvote-a":{def:!1,desc:"Auto downvote question upon downvoting an answer"}},{def:!1,direction:"left",type:"toggle"}),o;console.debug(`[${scriptName}] missing userscript configurer`)},loadConfigOption=async(o,e)=>{var t=((null==(t=unsafeWindow.UserScripters)?void 0:t.Userscripts)||{})["Configurer"],t=null==t?void 0:t.get(scriptName);return t?t.load(o,e):e},getPostVoteURL=(o,e)=>new URL(location.origin+`/posts/${o}/vote/`+e),voteOnPost=async(e,o)=>{try{var t=getPostVoteURL(e,o),n=new FormData;n.set("fkey",StackExchange.options.user.fkey);var{Message:s,Success:a}=await(await fetch(t,{method:"POST",body:n})).json();return a||console.debug(`[${scriptName}] error when voting on post #`+e,s),a}catch(o){return console.debug(`[${scriptName}] failed to vote on post #`+e,o),!1}},handleAutovote=async(o,e,t)=>{var n,{Message:t,Success:s}=t.responseJSON;return s?([n,s]=/\/(?:posts|questions)\/(\d+)\//.exec(e.toString())||[],Number.isNaN(+s)?(console.debug(`[${scriptName}] invalid post id: `+s),!1):voteOnPost(s,o)):(console.debug(`[${scriptName}] vote was unsuccessful`,t),!1)},handleVoteComplete=async(o,e,t,n)=>{var s=StackExchange.vote["voteTypeIds"],a=await loadConfigOption("upvote-on-accept",!0),i=await loadConfigOption("downvote-on-close",!1),c=await loadConfigOption("upvote-q-on-upvote-a",!1),d=await loadConfigOption("downvote-q-on-downvote-a",!1),r=[],e="answer"===e,u=StackExchange.question.getQuestionId(),p=getPostVoteURL(u,s.upMod),u=getPostVoteURL(u,s.downMod),a=(e&&a&&o===s.acceptedByOwner&&r.push(handleAutovote(s.upMod,t,n)),e&&c&&o===s.upMod&&r.push(handleAutovote(s.upMod,p,n)),e&&d&&o===s.downMod&&r.push(handleAutovote(s.downMod,u,n)),o===s.close||/\/close\/add/.test(t)),c=(i&&a&&r.push(handleAutovote(s.downMod,u,n)),await Promise.all(r));c||StackExchange.helpers.showToast("Something went wrong during autovote",{type:"danger"})};window.addEventListener("load",async()=>{null!==StackExchange&&void 0!==StackExchange&&StackExchange.ready(()=>{initScriptConfiguration();const a=/\/posts\/(\d+)\/vote\/(\d+)/;$(document).ajaxComplete((o,e,t)=>{var n,s,t=t["url"];t?([,s,n]=a.exec(t)||[],s=StackExchange.question.getQuestionId()===+s?"question":"answer",handleVoteComplete(+n,s,t,e)):console.debug(`[${scriptName}] missing URL: `+t)})})},{once:!0});