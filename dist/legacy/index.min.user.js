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

"use strict";var __awaiter=this&&this.__awaiter||function(e,a,c,s){return new(c=c||Promise)(function(n,t){function o(e){try{i(s.next(e))}catch(e){t(e)}}function r(e){try{i(s.throw(e))}catch(e){t(e)}}function i(e){var t;e.done?n(e.value):((t=e.value)instanceof c?t:new c(function(e){e(t)})).then(o,r)}i((s=s.apply(e,a||[])).next())})},__generator=this&&this.__generator||function(o,r){var i,a,c,s={label:0,sent:function(){if(1&c[0])throw c[1];return c[1]},trys:[],ops:[]},u={next:e(0),throw:e(1),return:e(2)};return"function"==typeof Symbol&&(u[Symbol.iterator]=function(){return this}),u;function e(n){return function(e){var t=[n,e];if(i)throw new TypeError("Generator is already executing.");for(;s=u&&t[u=0]?0:s;)try{if(i=1,a&&(c=2&t[0]?a.return:t[0]?a.throw||((c=a.return)&&c.call(a),0):a.next)&&!(c=c.call(a,t[1])).done)return c;switch(a=0,(t=c?[2&t[0],c.value]:t)[0]){case 0:case 1:c=t;break;case 4:return s.label++,{value:t[1],done:!1};case 5:s.label++,a=t[1],t=[0];continue;case 7:t=s.ops.pop(),s.trys.pop();continue;default:if(!(c=0<(c=s.trys).length&&c[c.length-1])&&(6===t[0]||2===t[0])){s=0;continue}if(3===t[0]&&(!c||t[1]>c[0]&&t[1]<c[3]))s.label=t[1];else if(6===t[0]&&s.label<c[1])s.label=c[1],c=t;else{if(!(c&&s.label<c[2])){c[2]&&s.ops.pop(),s.trys.pop();continue}s.label=c[2],s.ops.push(t)}}t=r.call(o,s)}catch(e){t=[6,e],a=0}finally{i=c=0}if(5&t[0])throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}}},__read=this&&this.__read||function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var o,r,i=n.call(e),a=[];try{for(;(void 0===t||0<t--)&&!(o=i.next()).done;)a.push(o.value)}catch(e){r={error:e}}finally{try{o&&!o.done&&(n=i.return)&&n.call(i)}finally{if(r)throw r.error}}return a},scriptName="voting-overcharged",initScriptConfiguration=function(){var e=((null==(e=unsafeWindow.UserScripters)?void 0:e.Userscripts)||{}).Configurer;if(e)return(e=e.register(scriptName,null==(e=window.Store)?void 0:e.locateStorage())).options({"downvote-on-close":{def:!1,desc:"Auto downvote when voting to close"},"upvote-on-accept":{def:!0,desc:"Auto upvote upon accepting"}},{def:!1,direction:"left",type:"toggle"}),e;console.debug("[".concat(scriptName,"] missing userscript configurer"))},loadConfigOption=function(n,o){return __awaiter(void 0,void 0,void 0,function(){var t;return __generator(this,function(e){return t=((null==(t=unsafeWindow.UserScripters)?void 0:t.Userscripts)||{}).Configurer,[2,(t=null==t?void 0:t.get(scriptName))?t.load(n,o):o]})})},voteOnPost=function(r,i){return __awaiter(void 0,void 0,void 0,function(){var t,n,o;return __generator(this,function(e){switch(e.label){case 0:return e.trys.push([0,3,,4]),t=new URL("".concat(location.origin,"/posts/").concat(r,"/vote/").concat(i)),(n=new FormData).set("fkey",StackExchange.options.user.fkey),[4,fetch(t,{method:"POST",body:n})];case 1:return[4,e.sent().json()];case 2:return t=e.sent(),n=t.Message,(o=t.Success)||console.debug("[".concat(scriptName,"] error when voting on post #").concat(r),n),[2,o];case 3:return o=e.sent(),console.debug("[".concat(scriptName,"] failed to vote on post #").concat(r),o),[2,!1];case 4:return[2]}})})},handleAutovote=function(o,r,i){return __awaiter(void 0,void 0,void 0,function(){var t,n;return __generator(this,function(e){return n=i.responseJSON,t=n.Message,n.Success?(n=__read(/\/(?:posts|questions)\/(\d+)\//.exec(r)||[],2),n[0],n=n[1],Number.isNaN(+n)?(console.debug("[".concat(scriptName,"] invalid post id: ").concat(n)),[2,!1]):[2,voteOnPost(n,o)]):(console.debug("[".concat(scriptName,"] accept vote was unsuccessful"),t),[2,!1])})})},handleVoteComplete=function(a,c,s){return __awaiter(void 0,void 0,void 0,function(){var t,n,o,r,i;return __generator(this,function(e){switch(e.label){case 0:return t=StackExchange.vote.voteTypeIds,[4,loadConfigOption("upvote-on-accept",!0)];case 1:return n=e.sent(),[4,loadConfigOption("downvote-on-close",!1)];case 2:return o=e.sent(),r=[],n&&a===t.acceptedByOwner&&r.push(handleAutovote(t.upMod,c,s)),i=a===t.close||/\/close\/add/.test(c),o&&i&&r.push(handleAutovote(t.downMod,c,s)),[4,Promise.all(r)];case 3:return e.sent()||StackExchange.helpers.showToast("Something went wrong during autovote",{type:"danger"}),[2]}})})};window.addEventListener("load",function(){return __awaiter(void 0,void 0,void 0,function(){return __generator(this,function(e){return null!==StackExchange&&void 0!==StackExchange&&StackExchange.ready(function(){initScriptConfiguration();var r=/\/posts\/\d+\/vote\/(\d+)/;$(document).ajaxComplete(function(e,t,n){var o,n=n.url;n?(o=__read(r.exec(n)||[],2)[1],handleVoteComplete(+o,n,t)):console.debug("[".concat(scriptName,"] missing URL: ").concat(n))})}),[2]})})},{once:!0});