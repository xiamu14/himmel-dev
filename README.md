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
      data.map((item) => {
        return Div([P(item.nickname)]);
      })
    ),
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

## Feature

- [x] support async function
- [x] bind event; proxy event
- [x] Image component
- [ ] support array; List and Item component
- [ ] Modal component; Portal
- [ ] onMount; onWillMount; onUnmount; onWillUnmount;
- [x] support unocss
- [x] use vite
- [ ] animation method

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
