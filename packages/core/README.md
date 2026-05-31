# Himmel

[![npm version](https://img.shields.io/npm/v/himmel.svg)](https://www.npmjs.com/package/himmel)
[![npm downloads](https://img.shields.io/npm/dm/himmel.svg)](https://www.npmjs.com/package/himmel)
[![license](https://img.shields.io/npm/l/himmel.svg)](https://github.com/xiamu14/himmel-dev/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6.svg)](https://www.typescriptlang.org/)

Himmel is a small TypeScript UI runtime for AI-friendly interfaces.

It focuses on small, readable, easy-to-review UI code for internal tools, plugin panels, dashboards, demos, and embeddable widgets.

## Install

```bash
bun add himmel
```

```bash
npm install himmel
```

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

## Exports

- `himmel`: root runtime helpers such as `createRoot` and `createNodeRef`
- `himmel/dom`: DOM node DSL such as `Div`, `Button`, `Input`, `List`, `Portal`
- `himmel/signal`: `signal`, `get`, `dispatch`, `derive`, `effect`

## Status

Himmel is an early runtime prototype. The v1 focus is stable DOM primitives, signal behavior, lifecycle events, list rendering, portal behavior, and small demo scenarios.

See the project roadmap: <https://github.com/xiamu14/himmel-dev>
