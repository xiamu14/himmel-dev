import { createRoot } from "himmel";
import { Button, Div, H1, H2, Img, Input, Li, List, Portal, Text } from "himmel/dom";
import { dispatch, get, signal } from "himmel/signal";
import "virtual:uno.css";
import himmelLogo from "./himmel-logo.svg";
import "./style.css";
import viteLogo from "./typescript.svg";

const countSignal = signal(0);
const hideSignal = signal(true);
const inputValueSignal = signal("");
const todoDraftSignal = signal("");
const todoListSignal = signal<string[]>(["Upgrade to Bun", "Verify signal updates"]);

function addTodo() {
  const title = get(todoDraftSignal).trim();
  if (!title) {
    return;
  }
  dispatch(todoListSignal, (items) => [...items, title]);
  dispatch(todoDraftSignal, "");
  const input = document.querySelector<HTMLInputElement>("#todo-input");
  if (input) {
    input.value = "";
  }
}

function App() {
  return Div([
    Div([
      Img(himmelLogo).className("logo").attrs({ alt: "himmel Logo" }),
      Img(viteLogo).className("logo").attrs({ alt: "TypeScript Logo" }),
    ]).className("flex gap-2 justify-center"),
    H1("Himmel + TypeScript"),
    Div(
      Button(() => `count is ${get(countSignal)}`)
        .attrs({ id: "counter" })
        .onClick(() => {
          dispatch(countSignal, (old) => old + 1);
        }),
    )
      .className("card")
      .attrs({ "data-xxx": "xxx" }),
    Input()
      .attrs({ type: "text", placeholder: "测试输入", "data-xxx": "xxx" })
      .className(
        "bg-gray-50 border border-gray-300 border-solid text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2",
      )
      .onInput((event) => {
        console.log(event.target.value);
        dispatch(inputValueSignal, event.target.value);
      }),
    Text(() => get(inputValueSignal)),
    Div([
      H2("Todo signal check"),
      Div([
        Input()
          .attrs({
            id: "todo-input",
            type: "text",
            placeholder: "Add a todo",
            "data-testid": "todo-input",
          })
          .className("todo-input")
          .onInput((event) => {
            dispatch(todoDraftSignal, event.target.value);
          }),
        Button("Add").attrs({ "data-testid": "todo-add" }).onClick(addTodo),
      ]).className("todo-row"),
      Text(() => `${get(todoListSignal).length} todo items`).attrs({
        "data-testid": "todo-count",
      }),
      List({
        data: () => get(todoListSignal),
        key: (item) => item,
        item: (item) =>
          Li([
            Text(item).className("todo-title"),
            Button("Done")
              .attrs({ "data-testid": `todo-done-${item}` })
              .onClick(() => {
                dispatch(todoListSignal, (items) => items.filter((current) => current !== item));
              }),
          ]).className("todo-item"),
      }).className("todo-list"),
    ]).className("todo-panel"),
    Button("show modal").onClick(() => {
      dispatch(hideSignal, false);
    }),
    Text("Click on the Himmel and TypeScript logos to learn more").className("read-the-docs"),
  ]);
}
Portal(
  Div(
    Div(
      Div(
        Div(
          "With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.",
        ).className("p-4 md:p-5 space-y-4"),
      ).className("relative bg-white rounded-lg shadow"),
    ).className("relative p-4 w-full max-w-2xl max-h-full m-auto"),
  )
    .className(
      "overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-100vw md:inset-0 h-[calc(100%-1rem)] h-full bg-gray-700/[0.8] flex",
    )
    .hide(() => get(hideSignal))
    .onClick(() => {
      dispatch(hideSignal, true);
    }),
  document.querySelector("body") as HTMLElement,
);

createRoot("#app", App);
