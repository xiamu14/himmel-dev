type Signal<T> = {
  val: T;
  prev: T;
  subscribers: Set<(old?: T) => void>;
};

export const effectObserverObject: { observer: (() => void) | undefined } = {
  observer: undefined,
};

export function signal<T>(initValue: T) {
  const signalObject: Signal<T> = {
    val: initValue,
    prev: initValue,
    subscribers: new Set(),
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
    // TODO: 这样只实现了一个 state 的监听，如果是多个了清除 observer
    effectObserverObject.observer = undefined;
  }
  return signal.val;
}

export function dispatch<T extends boolean | string | number | object>(
  signal: Signal<T>,
  val: T | ((prev: T) => T) | ((prev: T) => Promise<T>)
) {
  const prev = signal.val;
  const newVal = typeof val === "function" ? val(prev) : val;
  Promise.resolve(newVal).then((it) => {
    signal.val = it;
    signal.prev = prev;
  });
}

export function effect(fn: () => void) {
  effectObserverObject.observer = fn;
  // 副作用函数立即执行
  fn();
}

export function compute<T>(fn: () => T) {
  // TODO： 实现计算属性，包含多个 state 的组合值
  const current = fn();
  return signal(current);
}

// const count = signal("1");
// const big = signal("100");

// effect(() => {
//   console.log("effect", get(count) + get(big));
// });

// effect(() => {
//   console.log("effect2", get(big));
// });
// dispatch(big, (prev) => prev + "12");
