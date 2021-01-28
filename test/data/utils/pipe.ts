export const pipe = (...fns: any[]) => (args: any) =>
  fns.reduce((previous, current) => current(previous), args);
