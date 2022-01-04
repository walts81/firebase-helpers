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
exports.initFirebaseArray = void 0;
const firebase_service_1 = require("./firebase-service");
const initFirebaseArray = (dbRef, arr, commit, mutation, firebaseConfig) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, firebase_service_1.remove)(dbRef, firebaseConfig);
    for (const item of arr) {
        const snapshot = yield (0, firebase_service_1.push)(dbRef, item);
        item.key = snapshot.key;
        const newRef = (0, firebase_service_1.ref)(snapshot.ref.toString(), firebaseConfig);
        yield (0, firebase_service_1.update)(newRef, item, firebaseConfig);
    }
    if (!!commit && !!mutation) {
        commit(mutation, arr);
    }
});
exports.initFirebaseArray = initFirebaseArray;
