```ts
import { createRoot, createNodeRef } from "../core";
import { Div, Link, Text } from "../core/dom";
import { dispatch, get, signal } from "../core/signal";
import "./demo.css";
const hideState = signal(true);
const theme = signal("black");
const name = signal("world");

const [helloRef, getHelloRef] = createNodeRef();

const [modalWrapperRef , getModalWrapperRef]...

function ModalWrapper() {
  return Div().ref(getModalWrapperRef).id('modal-wrapper')
}

function Modal(children:{
  header: HNode<unknown>
}) {
  // return Portal().parent(modalWrapperRef)
  return Portal(
    Div([
      children.header
    ])
  ).parent('#modal-wrapper')
}

function Hello(name: string) {
  return Div([
    Text("hello " + name)
      .className(() => `text-blue ${get(theme)}`)
      .style({
        display: "flex",
        justifyContent: "center",
        width: "100%",
        padding: "12px",
      })
      .ref(getHelloRef),
    Link("test").href("https://www.baidu.com"),
    Ul().build({
      data:()=>get(todoListState),
      key:(item,index)=String(item),
      item: (item)=>Li(item)
    })
  ]);
}
function App() {
  return Div([Hello("你好"), Text(() => get(name) + "world")]);
}
createRoot("#root", App);

const totalState = derive(() => get(incomeState) - get(expenseState)) ; // Derive; no dispatch

get(totalState)

setTimeout(() => {
  dispatch(hideState, false);
  dispatch(theme, () => "light");
  console.log("height", helloRef.node?.clientHeight);
}, 3000);

setTimeout(() => {
  dispatch(hideState, true);
}, 5000);

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

- [x] full attribute
- [x] full event function (proxy event)
- [ ] Portal
- [ ] support svg （auto）

- [ ] test case
- [ ] benchmark

- [ ] doc site
- [ ] route
- [ ] di-fetch with swr
- [ ] starter template

- [ ] ui library

  - [ ] Modal component;
  - [ ] Input component;

- [ ] ssr

## 技术方案

props 是否实现响应式？

optimistic update : 乐观更新
