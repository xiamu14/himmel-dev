# Himmel

Himmel is a small UI runtime for AI-friendly interfaces.

It is not trying to become another React. React already has a mature app ecosystem. Himmel focuses on small, readable, easy-to-review UI code for internal tools, plugin panels, dashboards, demos, and embeddable widgets.

The core idea is a direct TypeScript DSL:

```ts
Div([
  Text(() => get(title)),
  Button("Run").onClick(runTask),
]).className("panel");
```

## Goals

- Make UI code easy for AI to generate and modify.
- Keep generated code readable for developers.
- Keep the runtime small and predictable.
- Prefer explicit lifecycle events over hidden conventions.
- Build stable primitives before building ecosystem features.

## Where Himmel Fits

Himmel is designed for small UI surfaces where clarity matters more than ecosystem size.

Good fits:

- agent-generated UI
- plugin panels
- internal tools
- small dashboards
- workflow widgets
- demos and prototypes
- embeddable widgets inside a larger product

These interfaces usually need a few clear states, a small amount of interaction, and predictable lifecycle behavior. They do not need a full app framework, a large component ecosystem, or a React-compatible runtime.

Himmel should optimize for four things:

- AI can write it with fewer hidden rules.
- Developers can review it quickly.
- Runtime behavior is explicit and easy to trace.
- The generated UI can be tested with simple examples.

Himmel is not the best choice for large product apps that need routing, data frameworks, deep design system integration, large third-party component ecosystems, or years of existing React investment.

## Non-goals

- Himmel is not a full React replacement.
- Himmel does not embed the React runtime.
- Himmel does not run React components.
- Himmel v1 does not provide an official animation API.
- React to Himmel codemod is a later v3 topic, not a v1 goal.

See [ROADMAP.md](./ROADMAP.md) for the current product direction.

## Current Status

Himmel is currently an early runtime prototype.

Implemented or partially implemented:

- DOM node DSL
- signal / get / dispatch
- derived signal
- async dispatch
- event binding
- image and link nodes
- lifecycle events
- List patch rendering
- Portal
- Vite package build
- demo package

Still needed for v1:

- stable attributes and events
- form/input behavior
- SVG primitives
- canvas primitive
- runtime tests
- List patch tests
- lifecycle and cleanup tests
- docs and examples for the v1 scenarios

## v1 Scope

v1 should prove that Himmel can build 7 small UI scenarios reliably:

1. Counter
2. Form
3. Todo/List
4. Modal/Portal
5. Async data view
6. SVG
7. Canvas

Animation is only a runtime capability requirement in v1. The runtime should make third-party animation libraries possible through stable `ref`, `onMount`, `onUnmount`, `className`, `style`, and `hide/remount` behavior. Himmel should not design an animation adapter before real demos prove the shape.

## Example

```ts
import { createRoot } from "himmel";
import { Button, Div, Text } from "himmel/dom";
import { dispatch, get, signal } from "himmel/signal";

const count = signal(0);

function App() {
  return Div([
    Text(() => `count is ${get(count)}`),
    Button("Add").onClick(() => {
      dispatch(count, (value) => value + 1);
    }),
  ]).className("panel");
}

createRoot("#app", App);
```

## List Example

```ts
import { Li, List } from "himmel/dom";
import { dispatch, get, signal } from "himmel/signal";

const todoList = signal<string[]>([]);

export function TodoList() {
  return List({
    data: () => get(todoList),
    key: (item) => item,
    item: (item) => Li(item),
  });
}

setTimeout(() => {
  dispatch(todoList, ["learn"]);
}, 1000);

setTimeout(() => {
  dispatch(todoList, ["learn", "build"]);
}, 3000);

setTimeout(() => {
  dispatch(todoList, ["build", "learn"]);
}, 6000);
```

## Development

```bash
pnpm install
pnpm -r --filter=himmel run build
pnpm -r --filter=demo run dev
```

## Packages

- `packages/core`: the `himmel` runtime package.
- `packages/demo`: Vite demo app.

## Future Direction

v2 should focus on AI generation experience: starter, playground, examples, diagnostics, cookbook docs, and API constraints that help AI generate correct code.

v3 or later can explore React to Himmel codemod. That work should be transparent, debuggable, and verifiable. It should convert only statically understandable React/JSX subsets into plain Himmel source code, without embedding React runtime.
