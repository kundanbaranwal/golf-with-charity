exports.generateDraw = (sourceNumbers = []) => {
  const numbers = new Set();

  const normalizedSource = sourceNumbers
    .map(Number)
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 45);

  for (const value of normalizedSource) {
    if (numbers.size >= 5) break;
    numbers.add(value);
  }

  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }

  return Array.from(numbers).sort((a, b) => a - b);
};
