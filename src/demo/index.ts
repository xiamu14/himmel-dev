import { createRoot, Div, P } from "../core";
import { createNodeRef } from "../core/HNode";
import { dispatch, get, signal } from "../core/signal";
import "./demo.css";
const hideState = signal(true);
const theme = signal("black");
const name = signal("world");
const [helloRef, getHelloRef] = createNodeRef();
function Hello(name: string) {
  return Div(
    P("hello " + name)
      .className(() => `text-blue ${get(theme)}`)
      .style({
        display: "flex",
        justifyContent: "center",
        width: "100%",
        padding: "12px",
      })
      .ref(getHelloRef)
  );
}
function App() {
  return Div([Hello("你好"), P(() => get(name) + "world")]);
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
