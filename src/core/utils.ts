export function debug(
  isDev: boolean = true,
  type: "log" | "warn" | "error" = "log"
) {
  return (...params: unknown[]) => {
    isDev && console[type](...params);
  };
}
