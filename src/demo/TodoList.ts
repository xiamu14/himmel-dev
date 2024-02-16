import { Item, List } from "../core/dom";
import { dispatch, get, signal } from "../core/signal";
const todoListState = signal<{ key: string; val: string }[]>([]);

export default function TodoList() {
  return List(
    () => get(todoListState),
    (item) => {
      return Item(item.val);
    }
  );
}

setTimeout(() => {
  dispatch(todoListState, [{ key: "0", val: "闲" }]);
}, 1000);
