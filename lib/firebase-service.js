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
Object.defineProperty(exports, "__esModule", { value: true });
exports.onValueOnce = exports.onArrayOnce = exports.set = exports.get = exports.update = exports.remove = exports.push = exports.onChildChanged = exports.onChildAdded = exports.onValue = exports.ref = exports.getPath = exports.init = void 0;
const app_1 = require("firebase/app");
const db = __importStar(require("firebase/database"));
let app = null;
let database = null;
const init = (firebaseConfig) => {
    if (!app && !!firebaseConfig) {
        app = (0, app_1.initializeApp)(firebaseConfig);
        database = db.getDatabase(app);
    }
};
exports.init = init;
const getPath = (parentRef, childPath) => {
    let result = '';
    const parentPath = parentRef.toString();
    result += parentPath;
    if (!result.endsWith('/'))
        result += '/';
    result += childPath;
    return result;
};
exports.getPath = getPath;
const ref = (path, firebaseConfig) => {
    (0, exports.init)(firebaseConfig);
    return db.ref(database, path);
};
exports.ref = ref;
const onValue = (query, callback, defaultValue, firebaseConfig) => {
    (0, exports.init)(firebaseConfig);
    return db.onValue(query, snapshot => {
        const val = snapshot.val();
        if (!!val || val === 0)
            callback(val);
        else
            callback(defaultValue);
    });
};
exports.onValue = onValue;
const onChildAdded = (query, callback, defaultValue, firebaseConfig) => {
    (0, exports.init)(firebaseConfig);
    return db.onChildAdded(query, snapshot => {
        const val = snapshot.val();
        if (!!val || val === 0)
            callback(val);
        else
            callback(defaultValue);
    });
};
exports.onChildAdded = onChildAdded;
const onChildChanged = (query, callback, defaultValue, firebaseConfig) => {
    (0, exports.init)(firebaseConfig);
    return db.onChildChanged(query, snapshot => {
        const val = snapshot.val();
        if (!!val || val === 0)
            callback(val);
        else
            callback(defaultValue);
    });
};
exports.onChildChanged = onChildChanged;
const push = (ref, data, firebaseConfig) => {
    return new Promise(resolve => {
        (0, exports.init)(firebaseConfig);
        db.push(ref, data).then(x => resolve(x));
    });
};
exports.push = push;
const remove = (ref, firebaseConfig) => {
    (0, exports.init)(firebaseConfig);
    return db.remove(ref);
};
exports.remove = remove;
const update = (ref, data, firebaseConfig) => {
    (0, exports.init)(firebaseConfig);
    return db.update(ref, data);
};
exports.update = update;
const get = (query, defaultValue, firebaseConfig) => {
    return new Promise(resolve => {
        (0, exports.init)(firebaseConfig);
        db.get(query).then(snapshot => {
            const val = snapshot.val();
            resolve(val || defaultValue);
        });
    });
};
exports.get = get;
const set = (ref, data, firebaseConfig) => {
    (0, exports.init)(firebaseConfig);
    return db.set(ref, data);
};
exports.set = set;
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
const onArrayOnce = (query, firebaseConfig) => {
    return new Promise(resolve => {
        (0, exports.init)(firebaseConfig);
        once(query, db.onValue).then(snapshot => {
            const data = [];
            if (snapshot.exists()) {
                snapshot.forEach(x => {
                    data.push(x.val());
                });
            }
            resolve(data);
        });
    });
};
exports.onArrayOnce = onArrayOnce;
const onValueOnce = (query, firebaseConfig) => {
    return new Promise(resolve => {
        (0, exports.init)(firebaseConfig);
        once(query, db.onValue).then(snapshot => {
            if (snapshot.exists()) {
                resolve(snapshot.val());
            }
            else {
                resolve(undefined);
            }
        });
    });
};
exports.onValueOnce = onValueOnce;
