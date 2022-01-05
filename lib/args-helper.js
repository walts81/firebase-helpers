"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgsToUse = exports.isArray = void 0;
const isArray = data => {
    return Object.prototype.toString.call(data) === '[object Array]';
};
exports.isArray = isArray;
function getArgsToUse(mapArr, commit, mutation, firebaseConfig) {
    const isStandardCommit = !!commit &&
        typeof commit === 'function' &&
        !!mutation &&
        typeof mutation === 'string';
    const isCommitMinusOne = !!mapArr &&
        typeof mapArr === 'function' &&
        !!commit &&
        typeof commit === 'string';
    const isStandarMapArr = !!mapArr && typeof mapArr === 'function';
    const mapArrToUse = isStandarMapArr && (isStandardCommit || !isCommitMinusOne)
        ? mapArr
        : (a) => (!!a && (0, exports.isArray)(a) ? [...a] : []);
    const commitToUse = isStandardCommit
        ? commit
        : isCommitMinusOne
            ? mapArr
            : () => ({});
    const mutationToUse = isStandardCommit
        ? mutation
        : isCommitMinusOne
            ? commit
            : '';
    const configToUse = !!mapArr && typeof mapArr === 'object'
        ? mapArr
        : !!commit && typeof commit === 'object'
            ? commit
            : !!mutation && typeof mutation === 'object'
                ? mutation
                : firebaseConfig;
    return { mapArrToUse, commitToUse, mutationToUse, configToUse };
}
exports.getArgsToUse = getArgsToUse;
