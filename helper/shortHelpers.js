// for plural of the
export const pluralDetector = (letter, number) =>
  `${number > 1 ? letter + 's' : letter}`;
