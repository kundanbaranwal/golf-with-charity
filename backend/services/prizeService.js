exports.calculatePrize = (totalPool) => {
  const safePool = Number(totalPool || 0);

  return {
    fiveMatch: safePool * 0.4,
    fourMatch: safePool * 0.35,
    threeMatch: safePool * 0.25,
  };
};

exports.countMatches = (drawNumbers = [], userNumbers = []) => {
  const drawSet = new Set(drawNumbers.map(Number));
  let matches = 0;

  for (const n of userNumbers.map(Number)) {
    if (drawSet.has(n)) matches += 1;
  }

  return matches;
};
