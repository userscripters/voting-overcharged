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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var scriptName = "voting-overcharged";
var initScriptConfiguration = function () {
    var _a, _b;
    var Configurer = (((_a = unsafeWindow.UserScripters) === null || _a === void 0 ? void 0 : _a.Userscripts) || {}).Configurer;
    if (!Configurer) {
        console.debug("[".concat(scriptName, "] missing userscript configurer"));
        return;
    }
    var script = Configurer.register(scriptName, (_b = window.Store) === null || _b === void 0 ? void 0 : _b.locateStorage());
    var commonConfig = {
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
var loadConfigOption = function (name, def) { return __awaiter(void 0, void 0, void 0, function () {
    var Configurer, script;
    var _a;
    return __generator(this, function (_b) {
        Configurer = (((_a = unsafeWindow.UserScripters) === null || _a === void 0 ? void 0 : _a.Userscripts) || {}).Configurer;
        script = Configurer === null || Configurer === void 0 ? void 0 : Configurer.get(scriptName);
        return [2, script ? script.load(name, def) : def];
    });
}); };
var getPostVoteURL = function (postId, voteTypeId) {
    return new URL("".concat(location.origin, "/posts/").concat(postId, "/vote/").concat(voteTypeId));
};
var voteOnPost = function (postId, voteTypeId) { return __awaiter(void 0, void 0, void 0, function () {
    var voteURL, body, res, _a, Message, Success, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                voteURL = getPostVoteURL(postId, voteTypeId);
                body = new FormData();
                body.set("fkey", StackExchange.options.user.fkey);
                return [4, fetch(voteURL, { method: "POST", body: body })];
            case 1:
                res = _b.sent();
                return [4, res.json()];
            case 2:
                _a = _b.sent(), Message = _a.Message, Success = _a.Success;
                if (!Success) {
                    console.debug("[".concat(scriptName, "] error when voting on post #").concat(postId), Message);
                }
                return [2, Success];
            case 3:
                error_1 = _b.sent();
                console.debug("[".concat(scriptName, "] failed to vote on post #").concat(postId), error_1);
                return [2, false];
            case 4: return [2];
        }
    });
}); };
var handleAutovote = function (voteTypeId, url, xhr) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, Message, Success, _b, _, postId;
    return __generator(this, function (_c) {
        _a = xhr.responseJSON, Message = _a.Message, Success = _a.Success;
        if (!Success) {
            console.debug("[".concat(scriptName, "] vote was unsuccessful"), Message);
            return [2, false];
        }
        _b = __read(/\/(?:posts|questions)\/(\d+)\//.exec(url.toString()) || [], 2), _ = _b[0], postId = _b[1];
        if (Number.isNaN(+postId)) {
            console.debug("[".concat(scriptName, "] invalid post id: ").concat(postId));
            return [2, false];
        }
        return [2, voteOnPost(postId, voteTypeId)];
    });
}); };
var handleVoteComplete = function (voteTypeId, postType, url, xhr) { return __awaiter(void 0, void 0, void 0, function () {
    var voteTypeIds, upvoteOnAccept, downvoteOnClose, upvoteQOnUpvoteA, downvoteQOnDownvoteA, handlerPromises, isAnswerVote, questionId, questionUpvoteURL, questionDownvoteURL, isVTC, status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                voteTypeIds = StackExchange.vote.voteTypeIds;
                return [4, loadConfigOption("upvote-on-accept", true)];
            case 1:
                upvoteOnAccept = _a.sent();
                return [4, loadConfigOption("downvote-on-close", false)];
            case 2:
                downvoteOnClose = _a.sent();
                return [4, loadConfigOption("upvote-q-on-upvote-a", false)];
            case 3:
                upvoteQOnUpvoteA = _a.sent();
                return [4, loadConfigOption("downvote-q-on-downvote-a", false)];
            case 4:
                downvoteQOnDownvoteA = _a.sent();
                handlerPromises = [];
                isAnswerVote = postType === "answer";
                questionId = StackExchange.question.getQuestionId();
                questionUpvoteURL = getPostVoteURL(questionId, voteTypeIds.upMod);
                questionDownvoteURL = getPostVoteURL(questionId, voteTypeIds.downMod);
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
                isVTC = voteTypeId === voteTypeIds.close || /\/close\/add/.test(url);
                if (downvoteOnClose && isVTC) {
                    handlerPromises.push(handleAutovote(voteTypeIds.downMod, questionDownvoteURL, xhr));
                }
                return [4, Promise.all(handlerPromises)];
            case 5:
                status = _a.sent();
                if (!status) {
                    StackExchange.helpers.showToast("Something went wrong during autovote", { type: "danger" });
                }
                return [2];
        }
    });
}); };
window.addEventListener("load", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        StackExchange === null || StackExchange === void 0 ? void 0 : StackExchange.ready(function () {
            initScriptConfiguration();
            var voteTypeRegExp = /\/posts\/(\d+)\/vote\/(\d+)/;
            $(document).ajaxComplete(function (_event, xhr, options) {
                var url = options.url;
                if (!url) {
                    console.debug("[".concat(scriptName, "] missing URL: ").concat(url));
                    return;
                }
                var _a = __read(voteTypeRegExp.exec(url) || [], 3), postId = _a[1], voteTypeId = _a[2];
                var postType = StackExchange.question.getQuestionId() === +postId
                    ? "question"
                    : "answer";
                handleVoteComplete(+voteTypeId, postType, url, xhr);
            });
        });
        return [2];
    });
}); }, { once: true });
