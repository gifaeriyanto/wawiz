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
        while (_) try {
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
exports.__esModule = true;
exports.blastMessages = exports.getGroupMembers = exports.sessionCreate = void 0;
var venom_bot_1 = require("venom-bot");
var sessionCreate = function (browserSession) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                venom_bot_1.create('wablast', undefined, undefined, {
                    headless: false,
                    logQR: false,
                    mkdirFolderToken: '/public',
                    waitForLogin: false
                }, browserSession)
                    .then(function (client) {
                    resolve(client);
                })["catch"](function (err) {
                    reject(err);
                });
            })];
    });
}); };
exports.sessionCreate = sessionCreate;
var getGroupMembers = function (client, groupId) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.getGroupMembers(groupId).then(function (res) {
                            result = res
                                .filter(function (_a) {
                                var isMe = _a.isMe;
                                return !isMe;
                            })
                                .map(function (_a) {
                                var id = _a.id, name = _a.name;
                                return ({
                                    id: id,
                                    name: name
                                });
                            });
                        })];
                case 2:
                    _a.sent();
                    resolve(result);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    reject(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
};
exports.getGroupMembers = getGroupMembers;
var blastMessages = function (_a) {
    var client = _a.client, ids = _a.ids, text = _a.text, filepath = _a.filepath, _b = _a.interval, interval = _b === void 0 ? 2000 : _b;
    var counter = 0;
    var i = setInterval(function () {
        var id = ids[counter].id._serialized;
        client
            .sendText(id, text)
            .then(function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                console.log('Successfully sent message to', (_a = ids[counter]) === null || _a === void 0 ? void 0 : _a.name, (_b = ids[counter]) === null || _b === void 0 ? void 0 : _b.id);
                if (filepath) {
                    client.sendImage(id, filepath);
                }
                counter++;
                if (counter === ids.length) {
                    clearInterval(i);
                    console.log('Done');
                }
                return [2 /*return*/];
            });
        }); })["catch"](function (err) {
            console.error('Error when sending: ', err);
        });
    }, interval);
};
exports.blastMessages = blastMessages;
var waUtils = {
    sessionCreate: exports.sessionCreate,
    getGroupMembers: exports.getGroupMembers,
    blastMessages: exports.blastMessages
};
exports["default"] = waUtils;
