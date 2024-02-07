import { Item, List } from "../core/dom";
import { dispatch, get, signal } from "../core/signal";
const todoListState = signal<string[]>([]);

export default function TodoList() {
  return List(() =>
    get(todoListState).map((item) => {
      return Item(item);
    })
  );
}

setTimeout(() => {
  dispatch(todoListState, ["闲", "观", "止", "落"]);
}, 1000);
