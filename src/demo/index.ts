import { createRoot, Div, P } from "../core";
import { dispatch, get, signal } from "../core/signal";
import "./demo.css";
const hideState = signal(true);
const theme = signal("black");
function App() {
  return Div([
    P("hello ").className(() => `text-blue ${get(theme)}`),
    P("world"),
  ]);
}
createRoot("#root", App);

setTimeout(() => {
  dispatch(hideState, false);
  dispatch(theme, "light");
}, 3000);

setTimeout(() => {
  dispatch(hideState, true);
}, 5000);
