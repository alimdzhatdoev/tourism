export const omitEmpty = <
  T extends Record<string, any>,
  K extends Array<keyof T>,
>(
  data: T,
  ...keys: K
) => {
  return Object.keys(data).reduce((newData, key) => {
    const value = data[key];
    if (keys.includes(key) && !value) {
      return newData;
    } else {
      return {
        ...newData,
        [key]: data[key],
      };
    }
  }, {}) as Omit<T, K[number]>;
};
