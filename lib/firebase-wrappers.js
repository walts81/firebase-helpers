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
exports.initializeApp = exports.getDatabase = exports.update = exports.set = exports.ref = exports.remove = exports.push = exports.onValue = exports.onChildChanged = exports.onChildAdded = exports.get = void 0;
const db = __importStar(require("firebase/database"));
const app = __importStar(require("firebase/app"));
exports.get = db.get;
exports.onChildAdded = db.onChildAdded;
exports.onChildChanged = db.onChildChanged;
exports.onValue = db.onValue;
exports.push = db.push;
exports.remove = db.remove;
exports.ref = db.ref;
exports.set = db.set;
exports.update = db.update;
exports.getDatabase = db.getDatabase;
exports.initializeApp = app.initializeApp;
