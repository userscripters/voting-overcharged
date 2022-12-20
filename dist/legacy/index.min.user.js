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

"use strict";var __awaiter=this&&this.__awaiter||function(e,c,i,s){return new(i=i||Promise)(function(n,t){function o(e){try{a(s.next(e))}catch(e){t(e)}}function r(e){try{a(s.throw(e))}catch(e){t(e)}}function a(e){var t;e.done?n(e.value):((t=e.value)instanceof i?t:new i(function(e){e(t)})).then(o,r)}a((s=s.apply(e,c||[])).next())})},__generator=this&&this.__generator||function(o,r){var a,c,i,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]},u={next:e(0),throw:e(1),return:e(2)};return"function"==typeof Symbol&&(u[Symbol.iterator]=function(){return this}),u;function e(n){return function(e){var t=[n,e];if(a)throw new TypeError("Generator is already executing.");for(;s=u&&t[u=0]?0:s;)try{if(a=1,c&&(i=2&t[0]?c.return:t[0]?c.throw||((i=c.return)&&i.call(c),0):c.next)&&!(i=i.call(c,t[1])).done)return i;switch(c=0,(t=i?[2&t[0],i.value]:t)[0]){case 0:case 1:i=t;break;case 4:return s.label++,{value:t[1],done:!1};case 5:s.label++,c=t[1],t=[0];continue;case 7:t=s.ops.pop(),s.trys.pop();continue;default:if(!(i=0<(i=s.trys).length&&i[i.length-1])&&(6===t[0]||2===t[0])){s=0;continue}if(3===t[0]&&(!i||t[1]>i[0]&&t[1]<i[3]))s.label=t[1];else if(6===t[0]&&s.label<i[1])s.label=i[1],i=t;else{if(!(i&&s.label<i[2])){i[2]&&s.ops.pop(),s.trys.pop();continue}s.label=i[2],s.ops.push(t)}}t=r.call(o,s)}catch(e){t=[6,e],c=0}finally{a=i=0}if(5&t[0])throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}}},__read=this&&this.__read||function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var o,r,a=n.call(e),c=[];try{for(;(void 0===t||0<t--)&&!(o=a.next()).done;)c.push(o.value)}catch(e){r={error:e}}finally{try{o&&!o.done&&(n=a.return)&&n.call(a)}finally{if(r)throw r.error}}return c},scriptName="voting-overcharged",voteOnPost=function(r,a){return __awaiter(void 0,void 0,void 0,function(){var t,n,o;return __generator(this,function(e){switch(e.label){case 0:return e.trys.push([0,3,,4]),t=new URL("".concat(location.origin,"/posts/").concat(r,"/vote/").concat(a)),(n=new FormData).set("fkey",StackExchange.options.user.fkey),[4,fetch(t,{method:"POST",body:n})];case 1:return[4,e.sent().json()];case 2:return t=e.sent(),n=t.Message,(o=t.Success)||console.debug("[".concat(scriptName,"] error when voting on post #").concat(r),n),[2,o];case 3:return o=e.sent(),console.debug("[".concat(scriptName,"] failed to vote on post #").concat(r),o),[2,!1];case 4:return[2]}})})},handleAutovote=function(o,r,a){return __awaiter(void 0,void 0,void 0,function(){var t,n;return __generator(this,function(e){return n=a.responseJSON,t=n.Message,n.Success?(n=__read(/\/posts\/(\d+)\//.exec(r)||[],2),n[0],n=n[1],Number.isNaN(+n)?(console.debug("[".concat(scriptName,"] invalid post id: ").concat(n)),[2,!1]):[2,voteOnPost(n,o)]):(console.debug("[".concat(scriptName,"] accept vote was unsuccessful"),t),[2,!1])})})};window.addEventListener("load",function(){return __awaiter(void 0,void 0,void 0,function(){return __generator(this,function(e){return null!==StackExchange&&void 0!==StackExchange&&StackExchange.ready(function(){var e=StackExchange.vote.voteTypeIds,t=e.acceptedByOwner,o=e.upMod,r=new RegExp("\\/posts\\/\\d+/vote\\/".concat(t));$(document).ajaxComplete(function(e,t,n){n=n.url;n&&r.test(n)?handleAutovote(o,n,t).then(function(e){e||StackExchange.helpers.showToast("Something went wrong during autovote",{type:"danger"})}):console.debug("[".concat(scriptName,"] URL not matched: ").concat(n))})}),[2]})})},{once:!0});