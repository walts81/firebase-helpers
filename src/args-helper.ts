export const isArray = (data: any) => {
  return Object.prototype.toString.call(data) === '[object Array]';
};

export function getArgsToUse<T>(
  mapArr: any,
  commit: any,
  mutation: any,
  firebaseConfig: any
) {
  const isStandardCommit =
    !!commit &&
    typeof commit === 'function' &&
    !!mutation &&
    typeof mutation === 'string';
  const isCommitMinusOne =
    !!mapArr &&
    typeof mapArr === 'function' &&
    !!commit &&
    typeof commit === 'string';
  const isStandarMapArr = !!mapArr && typeof mapArr === 'function';
  const mapArrToUse: any =
    isStandarMapArr && (isStandardCommit || !isCommitMinusOne)
      ? mapArr
      : (a: T[]) => (!!a && isArray(a) ? [...a] : []);

  const commitToUse: any = isStandardCommit
    ? commit
    : isCommitMinusOne
    ? mapArr
    : () => ({});
  const mutationToUse: any = isStandardCommit
    ? mutation
    : isCommitMinusOne
    ? commit
    : '';

  const configToUse =
    !!mapArr && typeof mapArr === 'object'
      ? mapArr
      : !!commit && typeof commit === 'object'
      ? commit
      : !!mutation && typeof mutation === 'object'
      ? mutation
      : firebaseConfig;
  return { mapArrToUse, commitToUse, mutationToUse, configToUse };
}
