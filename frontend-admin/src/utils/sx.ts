export const asx = <T extends any>(sx?: T) => {
  if (!sx) return [{}];
  return Array.isArray(sx) ? sx : [sx];
};
