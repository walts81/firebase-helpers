"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onValueOnce = exports.onArrayOnce = void 0;
const args_helper_1 = require("./args-helper");
const service = __importStar(require("./firebase-service"));
const once = (query, action) => {
    return new Promise(resolve => {
        let unsub = null;
        unsub = action(query, snapshot => {
            if (!!unsub)
                unsub();
            unsub = null;
            resolve(snapshot);
        });
    });
};
const onArrayOnce = (query, firebaseConfig) => __awaiter(void 0, void 0, void 0, function* () {
    service.init(firebaseConfig);
    const snapshot = yield once(query, service.onValue);
    const data = [];
    if (snapshot.exists()) {
        snapshot.forEach(x => {
            data.push(x.val());
        });
    }
    return data;
});
exports.onArrayOnce = onArrayOnce;
const onValueOnce = (query, firebaseConfig) => __awaiter(void 0, void 0, void 0, function* () {
    service.init(firebaseConfig);
    const snapshot = yield once(query, service.onValue);
    if (snapshot.exists()) {
        const data = snapshot.val();
        if (typeof data === 'object' && !(0, args_helper_1.isArray)(data))
            return Object.assign({ key: snapshot.key }, data);
        return data;
    }
    return undefined;
});
exports.onValueOnce = onValueOnce;
