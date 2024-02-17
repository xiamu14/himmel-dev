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
