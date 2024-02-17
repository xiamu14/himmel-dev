import { Li, List } from "../core/dom";
import { dispatch, get, signal } from "../core/signal";
const todoListState = signal<string[]>([]);

export default function TodoList() {
  return List({
    data: () => get(todoListState),
    key: (_) => _,
    item: (item) => Li(item),
  })
    .dev()
    .as("ul");
}

setTimeout(() => {
  dispatch(todoListState, ["闲"]);
}, 1000);

setTimeout(() => {
  dispatch(todoListState, ["闲", "云"]);
}, 3000);

setTimeout(() => {
  dispatch(todoListState, ["云", "闲"]);
}, 6000);
