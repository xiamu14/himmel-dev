```ts
import { createRoot, Div, P } from "../core";
function App() {
  return Div([P("hello "), P("world"), Div()]);
}
createRoot("#root", App);
```
