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
exports.set = exports.get = exports.update = exports.remove = exports.push = exports.onChildChanged = exports.onChildChangedWithCommit = exports.onChildAddedWithCommit = exports.onChildAdded = exports.onValue = exports.ref = exports.getPath = exports.init = void 0;
const db = __importStar(require("./firebase-wrappers"));
let app = null;
let database = null;
const init = (firebaseConfig) => {
    if (!app && !!firebaseConfig) {
        app = db.initializeApp(firebaseConfig);
        database = db.getDatabase(app);
    }
};
exports.init = init;
const getRootPath = (ref) => {
    let path = ref.key;
    let parent = ref.parent;
    while (!!parent && !!parent.key) {
        path = parent.key + '/' + path;
        parent = parent.parent;
    }
    return path;
};
const getPath = (parentRef, childPath) => {
    let result = '';
    const parentPath = getRootPath(parentRef);
    result += parentPath;
    if (!result.endsWith('/') && !childPath.startsWith('/'))
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
        let val = snapshot.val();
        if (!!val || val === 0) {
            if (typeof val === 'object') {
                val = Object.assign(Object.assign({}, val), { key: snapshot.key });
            }
            callback(val);
        }
        else
            callback(defaultValue);
    });
};
exports.onChildAdded = onChildAdded;
const onChildAddedOrChanged = (getArr, commit, mutation, mapData) => {
    return (data) => {
        const mapDataToUse = !!mapData
            ? mapData
            : x => (!!x && typeof x === 'object' ? Object.assign({}, x) : x);
        const arr = getArr().map(mapDataToUse);
        const dataToUse = mapDataToUse(data);
        let ix = -1;
        if (typeof data === 'object') {
            ix = arr.findIndex(x => x.key === dataToUse.key);
        }
        else {
            ix = arr.findIndex(x => x === dataToUse);
        }
        if (ix < 0)
            arr.push(dataToUse);
        else
            arr.splice(ix, 1, dataToUse);
        commit(mutation, arr);
    };
};
const onChildAddedWithCommit = (query, getArr, commit, mutation, mapData, defaultValue, firebaseConfig) => {
    return (0, exports.onChildAdded)(query, x => onChildAddedOrChanged(getArr, commit, mutation, mapData)(x), defaultValue, firebaseConfig);
};
exports.onChildAddedWithCommit = onChildAddedWithCommit;
const onChildChangedWithCommit = (query, getArr, commit, mutation, mapData, defaultValue, firebaseConfig) => {
    return (0, exports.onChildChanged)(query, x => onChildAddedOrChanged(getArr, commit, mutation, mapData)(x), defaultValue, firebaseConfig);
};
exports.onChildChangedWithCommit = onChildChangedWithCommit;
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
    (0, exports.init)(firebaseConfig);
    return db.push(ref, data).then(x => x);
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
const get = (query, defaultValue, firebaseConfig) => __awaiter(void 0, void 0, void 0, function* () {
    (0, exports.init)(firebaseConfig);
    const snapshot = yield db.get(query);
    const val = snapshot.val();
    return val || defaultValue;
});
exports.get = get;
const set = (ref, data, firebaseConfig) => {
    (0, exports.init)(firebaseConfig);
    return db.set(ref, data);
};
exports.set = set;
