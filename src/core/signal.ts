type Signal<T> = {
  val: T;
  prev: T;
  subscribers: Set<(old?: T) => void>;
  writeable?: boolean; // writable by dispatch function
};

export const effectObserverObject: { observer: (() => void) | undefined } = {
  observer: undefined,
};

export function signal<T>(initValue: T, options?: { writable: boolean }) {
  const signalObject: Signal<T> = {
    val: initValue,
    prev: initValue,
    subscribers: new Set(),
    writeable: options?.writable ?? true,
  };
  // 依赖收集
  return new Proxy(signalObject, {
    set(
      target: Signal<T>,
      prop: string | symbol,
      newValue: T
      // receiver: string
    ) {
      if (prop === "prev") {
        target.prev = newValue;
      }
      if (prop === "writable") {
        target.writeable = Boolean(newValue);
      }
      if (prop === "val") {
        console.log("target", target);
        const old = target.val;
        // console.log("xxxx", signalObject.subscribers);
        // 比较方法
        // 触发所有的依赖更新
        target.val = newValue;
        signalObject.subscribers.forEach((subscriber) => {
          // TODO: need transport  prev value
          subscriber(old);
        });
      }
      return true;
    },
  });
}
export function get<T>(signal: Signal<T>) {
  if (effectObserverObject.observer) {
    signal.subscribers.add(effectObserverObject.observer);
    // TODO: something
    effectObserverObject.observer = undefined;
  }
  return signal.val;
}

export function dispatch<T extends boolean | string | number | object>(
  signal: Signal<T>,
  val: T | ((prev: T) => T) | ((prev: T) => Promise<T>)
) {
  if (signal.writeable) {
    const prev = signal.val;
    const newVal = typeof val === "function" ? val(prev) : val;
    Promise.resolve(newVal).then((it) => {
      signal.val = it;
      signal.prev = prev;
    });
  } else {
    console.warn("can't use the dispatch function to modify a derived signal");
  }
}

export function effect(fn: () => void | Promise<void>) {
  effectObserverObject.observer = fn;
  // 副作用函数立即执行
  Promise.resolve(fn()).then(() => {
    // 监听设置完成以后要清除
    effectObserverObject.observer = undefined;
  });
}

export function derive<T extends boolean | string | number | object>(
  fn: () => T
) {
  effectObserverObject.observer = () => {
    derivedSignal.writeable = true;
    dispatch<T>(derivedSignal, fn);
    derivedSignal.writeable = false;
  };
  // 实现计算属性，包含多个 state 的组合值
  const derivedSignal = signal(fn());

  return derivedSignal;
}

const count = signal(1);
const big = derive(() => get(count) * 100);

effect(() => {
  console.log("effect", get(big));
});

dispatch(count, (prev) => prev + 1);
