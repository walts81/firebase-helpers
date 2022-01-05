"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAndSubscribeToFirebaseData = void 0;
const firebase_service_1 = require("./firebase-service");
const args_helper_1 = require("./args-helper");
function initAndSubscribeToFirebaseData(ref, defaultValue, callback, mutation, firebaseConfig) {
    const { mapArrToUse, commitToUse, mutationToUse, configToUse } = (0, args_helper_1.getArgsToUse)(callback, mutation, firebaseConfig, undefined);
    return (0, firebase_service_1.onValue)(ref, data => {
        let val = data;
        if (data === undefined) {
            val = defaultValue;
            if (val != null)
                (0, firebase_service_1.set)(ref, defaultValue, configToUse);
        }
        commitToUse(mutationToUse, val);
        mapArrToUse(val);
    }, undefined, configToUse);
}
exports.initAndSubscribeToFirebaseData = initAndSubscribeToFirebaseData;
