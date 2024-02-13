export function warn(isDev: boolean = true, type: "warn" | "error" = "warn") {
  return (...params: unknown[]) => {
    isDev && console[type](...params);
  };
}

export function debug(...data: unknown[]) {
  if (__DEV__) {
    console.log(...data);
  }
}
