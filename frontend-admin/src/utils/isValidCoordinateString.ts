export const isValidCoordinateString = (str: string) => {
  // Regular expression to check if string is a latitude and longitude

  // eslint-disable-next-line no-useless-escape
  const regexExp = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/gi;

  return regexExp.test(str);
};
