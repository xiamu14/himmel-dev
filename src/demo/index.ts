import { createRoot, createNodeRef } from "../core";
import { Div, Img, Link, Text } from "../core/dom";
import { dispatch, get, signal } from "../core/signal";
import "./demo.css";
import "virtual:uno.css";
const hideState = signal(true);
const theme = signal("black");
const name = signal("world");
const [helloRef, getHelloRef] = createNodeRef();
function Hello(name: string) {
  return Div([
    Text("hello " + name)
      .className(() => `text-blue w-full flex justify-center ${get(theme)}`)
      .ref(getHelloRef),
    Link("test").href("https://www.baidu.com"),
    Img(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKcUURmHtvXIKSfWXWCCvzPJvT30o5nsV7xZJSvBDqHw&s"
    ).style({
      width: "180px",
      height: "200px",
      objectFit: "cover",
    }),
  ]).onClick(() => {
    console.log("click", get(theme));
  });
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
