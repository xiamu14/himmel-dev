```ts
import { createRoot, Div, P } from "../core";
import { signal, effect, dispatch } from "../core/reactive";

const count = signal(0);
effect(() => {
  if (get(count) > 20) {
    console.log("error");
  }
});

function App() {
  return Div([
    P(`hello ${count()}`),
    P(`world ${user().nickname}`),
    Div().onClick(() => {
      dispatch(count, (prev) => 12);
    }),
  ]);
}
createRoot("#root", App);
```

- [ ] support async function
- [ ] immutable data
- [ ] support unocss
- [ ] apply attribute
- [ ] bind event; proxy event
