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
exports.updateFirebaseArray = void 0;
const firebase_service_1 = require("./firebase-service");
const updateFirebaseArray = (parentRef, arr, commit, mutation, firebaseConfig) => __awaiter(void 0, void 0, void 0, function* () {
    for (const item of arr) {
        const path = (0, firebase_service_1.getPath)(parentRef, item.key);
        const dbRef = (0, firebase_service_1.ref)(path, firebaseConfig);
        yield (0, firebase_service_1.update)(dbRef, item, firebaseConfig);
    }
    if (!!commit && !!mutation) {
        commit(mutation, arr);
    }
});
exports.updateFirebaseArray = updateFirebaseArray;
