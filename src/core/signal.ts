type Signal<T> = {
  val: T;
  prev: T;
  subscribers: Set<(old?: T) => void>;
  deriveKey?: Symbol;
};
type Observer = (() => void) | undefined;

class ObserverHelper {
  _observer: Observer;
  public get observer() {
    return this._observer;
  }

  public set observer(observer: Observer) {
    this._observer = observer;
  }

  public clear() {
    this._observer = undefined;
  }

  public bind<T>(observer: () => void, executor: () => T): T {
    this._observer = observer;
    const result = executor();
    this.clear;
    return result;
  }
}

export const observerHelper = new ObserverHelper();

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
      newValue: any
      // receiver: string
    ) {
      if (prop === "prev") {
        target.prev = newValue;
      }
      if (prop === "deriveKey") {
        target.deriveKey = newValue;
      }
      if (prop === "val") {
        // console.log("target", target);
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
  if (observerHelper.observer) {
    signal.subscribers.add(observerHelper.observer);
  }
  return signal.val;
}

export function dispatch<T extends boolean | string | number | object>(
  signal: Signal<T>,
  val: T | ((prev: T) => T) | ((prev: T) => Promise<T>),
  deriveKey?: Symbol
) {
  // console.log(deriveKey, signal);
  if (!deriveKey || (deriveKey && signal.deriveKey === deriveKey)) {
    const prev = signal.val;
    const newVal = typeof val === "function" ? val(prev) : val;
    Promise.resolve(newVal).then((it) => {
      signal.val = it;
      signal.prev = prev;
    });
  } else {
    console.error("can't use the dispatch function to modify a derived signal");
  }
}

export function effect(fn: () => void | Promise<void>) {
  observerHelper.observer = fn;
  // 副作用函数立即执行
  Promise.resolve(fn()).then(() => {
    observerHelper.clear();
  });
}

export function derive<T extends boolean | string | number | object>(
  fn: () => T
) {
  const deriveKey = Symbol("deriveKey");
  const derivedSignal = observerHelper.bind(
    () => {
      dispatch<T>(derivedSignal, fn, deriveKey);
    },
    () => {
      // 实现计算属性，包含多个 state 的组合值
      const newDerivedSignal = signal(fn());
      newDerivedSignal.deriveKey = deriveKey;
      return newDerivedSignal;
    }
  );

  return derivedSignal;
}

// TEST CASE

// const count = signal(1);
// const big = derive(() => get(count) * 100);

// const user = signal({ name: "stupid" });

// effect(() => {
//   console.log("effect0", get(big));
//   console.log("effect1", get(user).name);
// });

// dispatch(count, (prev) => prev + 1); // TODO: 完善类型 when we need a eslint
// setTimeout(() => {
//   dispatch(user, { name: "smart" });
// }, 1000);

// effect(() => {
//   console.log("effect3", get(user).name);
// });
