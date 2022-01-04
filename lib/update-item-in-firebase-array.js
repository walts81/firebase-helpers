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
exports.updateItemInFirebaseArray = void 0;
const firebase_service_1 = require("./firebase-service");
const updateItemInFirebaseArray = (parentRef, item, arr, mapArr, commit, mutation, firebaseConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const clonedArr = !!mapArr ? mapArr(arr) : [...arr];
    const ix = clonedArr.findIndex(x => x.key === item.key);
    if (ix > -1) {
        clonedArr.splice(ix, 1, item);
        if (!!commit && !!mutation) {
            commit(mutation, clonedArr);
        }
    }
    if (!!item.key) {
        const path = (0, firebase_service_1.getPath)(parentRef, item.key);
        const dbRef = (0, firebase_service_1.ref)(path, firebaseConfig);
        yield (0, firebase_service_1.update)(dbRef, item, firebaseConfig);
    }
});
exports.updateItemInFirebaseArray = updateItemInFirebaseArray;
