// for plural of the
export const pluralDetector = (letter, number) =>
  `${number > 1 ? letter + "s" : letter}`;

export function checkNestedProperties(obj) {
  if (obj === null || obj === undefined || obj === "") {
    return false;
  }

  if (typeof obj !== "object" || Array.isArray(obj)) {
    return true;
  }

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (!checkNestedProperties(value)) {
        return false;
      }
    }
  }

  return true;
}
