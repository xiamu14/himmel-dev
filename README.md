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
    Div(
    // FIXME: get(dataState) 会出错
      data.map((item) => {
        return Div([P(item.nickname)]);
      })
    ),
    // TODO: 实现 diff 方法，细颗粒度更新 dom
    List(()=> get(todoListState).(item)=>Item(item)).className().onClick(event=>{})
    List(
    ()=get(listState).map((item)=Item(item)
    )
    )
  ]);
}
function App() {
  return Div([Hello("你好"), Text(() => get(name) + "world")]);
}
createRoot("#root", App);

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
- [ ] Element meta data; diff algorithm
- [ ] support array; List and Item component
- [ ] Modal component; Portal
- [ ] animation method
- [ ] onMount; onWillMount; onUnmount; onWillUnmount;

- [ ] full attribute
- [ ] full event function
- [ ] support svg （auto）

- [ ] test case
- [ ] benchmark

- [ ] doc site

- [ ] route
- [ ] ui library
- [ ] di-fetch with swr
- [ ] headless ui library
- [ ] starter template

- [ ] ssr
