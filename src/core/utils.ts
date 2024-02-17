export function debug(
  show: boolean = true,
  type: "log" | "warn" | "error" = "log"
) {
  return (...params: unknown[]) => {
    show && console[type](...params);
  };
}

export function uniqueId() {
  return Math.round(Math.random() * 1000) + Date.now().toString(36);
}

export function insertAfter(newNode: HTMLElement, existingNode: HTMLElement) {
  existingNode.parentNode?.insertBefore(newNode, existingNode.nextSibling);
}

export function isObject<T>(data: unknown): data is T {
  return Object.prototype.toString.call(data) === "[object Object]";
}
