import { createRoot, createNodeRef } from "../core";
import { Div, Link, Text } from "../core/dom";
import { dispatch, get, signal } from "../core/signal";
import "./demo.css";
const hideState = signal(true);
const theme = signal("black");
const name = signal("world");
const [helloRef, getHelloRef] = createNodeRef();
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
  ]);
}
function App() {
  return Div([Hello("你好"), Text(() => get(name) + "world")]);
}
createRoot("#root", App);

setTimeout(() => {
  dispatch(hideState, false);
  dispatch(theme, "light");
  console.log("height", helloRef.node?.clientHeight);
}, 3000);

setTimeout(() => {
  dispatch(hideState, true);
}, 5000);
