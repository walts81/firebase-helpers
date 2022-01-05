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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseArray = void 0;
const once_1 = require("./once");
const args_helper_1 = require("./args-helper");
function getFirebaseArray(query, mapArray, commit, mutation, firebaseConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const { mapArrToUse, commitToUse, mutationToUse, configToUse } = (0, args_helper_1.getArgsToUse)(mapArray, commit, mutation, firebaseConfig);
        const arr = yield (0, once_1.onArrayOnce)(query, configToUse);
        const mappedArr = mapArrToUse(arr);
        commitToUse(mutationToUse, mappedArr);
        return mappedArr;
    });
}
exports.getFirebaseArray = getFirebaseArray;
