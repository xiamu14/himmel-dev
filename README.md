```ts
import { createNodeRef } from "../core";
import { Div, Img, Link, Text } from "../core/dom";
import { dispatch, get, signal } from "../core/signal";
import TodoList from "./TodoList";
import "./demo.css";

const hideState = signal(true);
const theme = signal("black");
const name = signal("world");
const [helloRef, getHelloRef] = createNodeRef();

function Hello(name: string) {
  return Div([
    Link("Baidu")
      .href("https://www.baidu.com")
      .className("mb-2")
      .attrs({ target: "_blank" }),
    Text("hello " + name)
      .className(
        () =>
          `text-blue p-20px font-bold text-xl flex justify-center ${get(theme)}`
      )
      .ref(getHelloRef)
      .hide(() => get(hideState))
      .onWillMount(() => {
        console.log(
          "%c willMount",
          "color:white;background: #18a0f1;padding:4px",
          "",
          helloRef
        );
      })
      .onMount(() => {
        console.log(
          "%c mount",
          "color:white;background: #18a0f1;padding:4px",
          helloRef
        );
      })
      .onWillUnmount(() => {
        console.log(
          "%c willUnmount",
          "color:white;background: #18a0f1;padding:4px",
          helloRef
        );
      })
      .onUnmount(() => {
        console.log(
          "%c unmount",
          "color:white;background: #18a0f1;padding:4px",
          "",
          helloRef
        );
      })
      .attrs({ contentEditable: true }),

    Img(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKcUURmHtvXIKSfWXWCCvzPJvT30o5nsV7xZJSvBDqHw&s"
    ).style({
      width: "180px",
      height: "200px",
      objectFit: "cover",
    }),
    TodoList(),
    // Div(["0", "1", 2, 3]), // 毫无意义
  ])
    .className("flex flex-col justify-center items-center")
    .onClick(() => {
      console.log("click", get(theme));
    });
}

export default function App() {
  return Div([Hello("你好")]);
}

setTimeout(() => {
  dispatch(hideState, false);
  dispatch(theme, () => "light");
}, 3000);

dispatch(name, async () => {
  await sleep(3);
  return "John";
});

function sleep(second: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, second * 1000);
  });
}
```

```ts TodoList.ts
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
```

## Bug

- [x] replace when the reactive value is updated.
- [x] fix the bug caused by observer not clear.

## Feature

- [x] support async function
- [x] bind event; proxy event
- [x] Image component
- [x] support unocss
- [x] use vite
- [x] support array; List and Item component
- [x] derive and listen multiple signal (⭐️⭐️⭐️)

- [x] onMount; onWillMount; onUnmount; onWillUnmount;

- [x] Element meta data; diff algorithm (⭐️⭐️⭐️) [v1 refactor plan: HNode]
- [ ] animation method

- [x] package build

- [ ] full attribute
- [ ] full event function (proxy event)
- [x] Portal
- [x] monorepo packages
- [ ] support svg
- [ ] canvas component
- [ ] Form & Input component

- [ ] test case
- [ ] benchmark

- [ ] doc site
- [ ] route

- [x] starter template

- [ ] ui library

  - [x] Modal component;

- [ ] di-fetch
  - [ ] optimistic update
- [ ] ssr
