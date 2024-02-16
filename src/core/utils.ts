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

export function uniqueId() {
  return Math.round(Math.random() * 1000) + Date.now().toString(36);
}

export function insertAfter(newNode: HTMLElement, existingNode: HTMLElement) {
  existingNode.parentNode?.insertBefore(newNode, existingNode.nextSibling);
}
