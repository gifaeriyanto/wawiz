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
exports.app = void 0;
var whatsapp_1 = require("./utils/whatsapp");
var express = require('express');
var Store = require('electron-store');
var store = new Store();
exports.app = express();
var client;
var venomInit = function (_req, _res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!client) return [3 /*break*/, 2];
                return [4 /*yield*/, whatsapp_1["default"].sessionCreate(store.get('token'))];
            case 1:
                client = _a.sent();
                client.onStateChange(function (state) {
                    if (state === 'CONNECTED') {
                        console.log('yeyyyyyy');
                    }
                });
                _a.label = 2;
            case 2:
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.app.use(venomInit);
exports.app.get('/', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // client.waitForQrCodeScan((qrCode) => {
        // });
        res.json({ success: true, qrCode: store.get('token') });
        return [2 /*return*/];
    });
}); });
exports.app.get('/token', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.getSessionTokenBrowser()];
            case 1:
                token = _a.sent();
                store.set('token', token);
                res.json({ success: true, token: store.get('token') });
                return [2 /*return*/];
        }
    });
}); });
exports.app.get('/get-groups', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var groups, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.getAllGroups()];
            case 1:
                groups = _a.sent();
                data = groups.map(function (_a) {
                    var id = _a.id, name = _a.name, groupMetadata = _a.groupMetadata;
                    return {
                        id: id,
                        name: name,
                        participants: groupMetadata.participants.length
                    };
                });
                res.json({ data: data });
                return [2 /*return*/];
        }
    });
}); });
exports.app.get('/get-group-members/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        whatsapp_1["default"]
            .getGroupMembers(client, req.params.id)
            .then(function (data) { return res.json({ count: data.length, data: data }); })["catch"](function () { return res.json({ error: 'Invalid group id' }); });
        return [2 /*return*/];
    });
}); });
exports.app.get('/get-contacts', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.getAllContacts()];
            case 1:
                data = (_a.sent())
                    .filter(function (_a) {
                    var id = _a.id, isMe = _a.isMe;
                    return !isMe && id.server === 'c.us';
                })
                    .map(function (_a) {
                    var id = _a.id, name = _a.name;
                    return {
                        id: id,
                        name: name
                    };
                });
                res.json({ count: data.length, data: data });
                return [2 /*return*/];
        }
    });
}); });
var server = exports.app.listen(3001, function () {
    console.log('Wawiz API listening on port ' + server.address().port);
});
