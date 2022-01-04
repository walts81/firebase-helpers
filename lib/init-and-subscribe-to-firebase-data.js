"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAndSubscribeToFirebaseData = void 0;
const firebase_service_1 = require("./firebase-service");
const initAndSubscribeToFirebaseData = (parentRef, childPath, defaultValue, callback, commit, mutation, firebaseConfig) => {
    const path = (0, firebase_service_1.getPath)(parentRef, childPath);
    const dbRef = (0, firebase_service_1.ref)(path, firebaseConfig);
    return (0, firebase_service_1.onValue)(dbRef, data => {
        let val = data;
        if (data === undefined) {
            val = defaultValue;
            (0, firebase_service_1.set)(dbRef, defaultValue, firebaseConfig);
        }
        if (!!commit && !!mutation) {
            commit(mutation, val);
        }
        if (!!callback) {
            callback(val);
        }
    }, undefined, firebaseConfig);
};
exports.initAndSubscribeToFirebaseData = initAndSubscribeToFirebaseData;
