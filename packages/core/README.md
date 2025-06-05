# Himmel Core Documentation

Welcome to the Himmel Core documentation. Himmel Core is a reactive UI library for building web applications.

## Main Concepts

### Signals
Signals are the foundation of reactivity in Himmel. They are data stores that, when their value changes, automatically notify any parts of your application that depend on them. This allows for declarative and efficient UI updates.

### Components (HNodes)
Himmel uses a component-based architecture. Components are essentially functions that return `HNode` objects (or trees of `HNodes`). `HNode` is Himmel's internal representation of a DOM element, managing its properties, attributes, children, and lifecycle. Functions like `Div()`, `Text()`, `Img()` are used to create these `HNodes`.

### Rendering
Himmel applications are typically started using `createRoot()`. This function takes a DOM element ID (where the app will be mounted) and a main component function. Himmel then builds the `HNode` tree and renders it into the specified DOM container.

## API Reference

### Reactivity (`signal.ts`)

This section will detail the functions related to state management and reactivity.

#### `signal<T>(initialValue: T): Signal<T>`
Creates a new signal holding reactive data.
- **`initialValue`**: The initial value of the signal.
- **Returns**: A `Signal` object.

**Example:**
```typescript
import { signal, dispatch, get, effect } from 'himmel/signal';

const count = signal(0);
const message = signal("Hello");

effect(() => {
  console.log("Current count:", get(count));
});

dispatch(count, 1); // Console will log: Current count: 1
```

#### `get<T>(signal: Signal<T>): T`
Retrieves the current value of a signal. If called within an `effect` or a component's render function, it establishes a subscription, causing the effect/component to re-run/re-render when the signal's value changes.
- **`signal`**: The signal object from which to retrieve the value.
- **Returns**: The current value of the signal.

**Example:**
```typescript
const count = signal(10);
console.log(get(count)); // Output: 10
```

#### `dispatch<T>(signal: Signal<T>, value: T | ((prev: T) => T) | ((prev: T) => Promise<T>)): void`
Updates the value of a signal and notifies all its subscribers.
- **`signal`**: The signal object to update.
- **`value`**: The new value, or a function that receives the previous value and returns the new value. This function can also be asynchronous and return a Promise.
- **Returns**: `void`.

**Example:**
```typescript
const count = signal(0);

// Direct update
dispatch(count, 5);
console.log(get(count)); // Output: 5

// Functional update
dispatch(count, (prev) => prev + 1);
console.log(get(count)); // Output: 6

// Async functional update
dispatch(count, async (prev) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return prev + 1;
});
// After ~100ms, count will be 7
```

#### `effect(fn: () => void | Promise<void>): void`
Creates a reactive computation that runs automatically. The provided function is executed immediately, and then re-executed whenever any signal whose value was accessed using `get()` inside `fn` changes.
- **`fn`**: The function to execute. Can be synchronous or asynchronous.
- **Returns**: `void`.

**Example:**
```typescript
const firstName = signal("John");
const lastName = signal("Doe");

effect(() => {
  console.log(`My name is ${get(firstName)} ${get(lastName)}`);
});
// Output: My name is John Doe

dispatch(firstName, "Jane");
// Output: My name is Jane Doe
```

#### `derive<T>(fn: () => T): Signal<T>`
Creates a new signal whose value is computed based on other signals. The derived signal automatically updates its value when any of its underlying signal dependencies change.
- **`fn`**: A function that computes the value of the derived signal. Values from other signals should be accessed using `get()` within this function.
- **Returns**: A new read-only `Signal` object representing the derived state.

**Example:**
```typescript
const count = signal(2);
const doubleCount = derive(() => get(count) * 2);

effect(() => {
  console.log("Double count is:", get(doubleCount));
});
// Output: Double count is: 4

dispatch(count, 3);
// Output: Double count is: 6
```

---

### DOM Elements & Rendering (`dom.ts`)

Himmel provides a set of functions to create and manage DOM elements in a declarative way. These functions typically return `HNode` instances, which are Himmel's representation of DOM nodes.

#### `HNode`
`HNode` is the core class representing an element in the Himmel UI tree. It manages the element's type (e.g., 'div', 'p'), properties, attributes, children, and lifecycle events. You usually don't interact with `HNode` directly but rather through creator functions like `Div()`, `Text()`, etc.

**Common `HNode` Methods (chainable):**
(Note: This is a common pattern observed; specific methods might vary or have more options.)
- `.className(string | () => string)`: Sets the HTML class. Can be a string or a function returning a string for dynamic classes.
- `.style({[key: string]: string | () => string})`: Sets inline styles. Values can be functions for dynamic styles.
- `.onClick(() => void)`: Adds a click event listener. Other event listeners like `.onInput()`, `.onSubmit()` likely follow a similar pattern.
- `.attrs({[key: string]: any})`: Sets HTML attributes.
- `.hide(() => boolean)`: Conditionally hides the element.
- `.ref(NodeRef)`: Associates a node reference (created by `createNodeRef`) with this HNode.
- Lifecycle methods: `.onWillMount()`, `.onMount()`, `.onWillUnmount()`, `.onUnmount()` allow running code at specific points in the component lifecycle.

#### `createRoot<E extends HTMLElement>(containerId: string, Main: () => HNode<E>)`
Initializes and mounts a Himmel application into the DOM.
- **`containerId`**: The ID of the DOM element where the application will be rendered (e.g., `#app`).
- **`Main`**: A function that returns the root `HNode` of your application.
- **Returns**: `void`.

**Example:**
```typescript
import { createRoot, Div, Text } from 'himmel'; // Assuming exports from 'himmel' top-level

function App() {
  return Div([
    Text("Hello from Himmel!")
  ]);
}

createRoot('#app', App);
```

#### Element Creator Functions
These functions create `HNode` instances for common HTML elements.

- **`Div(children?: HChildren): HNode<HTMLDivElement>`**: Creates a `<div>` element.
- **`Text(children?: HChildren): HNode<HTMLParagraphElement>`**: Creates a `<p>` element by default.
- **`Span(children?: HChildren): HNode<HTMLSpanElement>`**: Creates a `<span>` element.
- **`Button(children?: HChildren): HNode<HTMLButtonElement>`**: Creates a `<button>` element.
- **`Input(): InputNode`**: Creates an `<input>` element. `InputNode` likely has specific methods like `.value()` or `.onInput()`.
- **`Link(children?: string): LinkNode`**: Creates an `<a>` (anchor) element. `LinkNode` likely has methods like `.href()`.
- **`Img(src: string): ImgNode`**: Creates an `<img>` element. `ImgNode` likely has methods like `.src()`.
- **`H1(children?: HChildren): HNode<HTMLHeadingElement>`**: Creates an `<h1>` element. (Similarly for `H2`, `H3`, `H4`, `H5`, `H6`)
- **`Hr(): HNode<HTMLHRElement>`**: Creates an `<hr>` element.
- **`Li(children?: HChildren): HNode`**: Creates an `<li>` element.
- **`List<Item, E extends HTMLElement>(builder: ListChildrenBuilder<Item, E>): HNode<E>`**: A powerful function for rendering lists of items.
    - `builder` is an object that typically contains:
        - `data: () => Item[]`: A function returning the array of data items.
        - `key: (item: Item) => string | number`: A function returning a unique key for each item.
        - `item: (item: Item) => HNode`: A function that takes an item and returns its `HNode` representation.

**Example (Div, Text, List):**
```typescript
import { signal, dispatch, get, derive } from 'himmel/signal';
import { createRoot, Div, Text, List, Li, Button } from 'himmel'; // Assuming exports

const items = signal(['Apple', 'Banana']);
const newItemName = signal('');

function MyList() {
  return Div([
    List({
      data: () => get(items),
      key: (item) => item,
      item: (name) => Li([
        Text(name),
        Button('Remove').onClick(() => {
          dispatch(items, currentItems => currentItems.filter(it => it !== name));
        })
      ])
    }),
    // Example of adding to list (simplified)
    // Input().value(get(newItemName)).onInput(e => dispatch(newItemName, e.target.value)),
    // Button('Add').onClick(() => {
    //   dispatch(items, current => [...current, get(newItemName)]);
    //   dispatch(newItemName, '');
    // })
  ]);
}

// createRoot('#app', MyList); // Mount it
```

#### `createNodeRef()`
Creates a reference that can be attached to an `HNode` using the `.ref()` method. This allows you to get direct access to the underlying DOM element or `HNode` instance after it's mounted.
- **Returns**: A `NodeRef` object (typically a tuple `[ref, getterFn]`).

**Example:**
```typescript
import { createNodeRef, Div, Text, effect } from 'himmel';

const [myDivRef, getMyDivRef] = createNodeRef();

function MyComponent() {
  return Div([
    Text("I'm a div")
  ]).ref(getMyDivRef);
}

// After MyComponent is mounted:
// const divElement = getMyDivRef().element; // Access the actual DOM element
// console.log(divElement);
```

#### `Portal<E extends HTMLElement, PE extends HTMLElement>(node: HNode<E>, mount: HNode<PE> | HTMLElement)`
Renders a given `HNode` (`node`) into a different DOM location (`mount`) instead of its logical place in the component tree.
- **`node`**: The `HNode` to render in the portal.
- **`mount`**: The target `HNode` or raw `HTMLElement` where the `node` should be appended.

**Example:**
```typescript
// Assume 'modal-root' is an existing DOM element outside the main app container
// const modalRootElement = document.getElementById('modal-root');
// const myModalContent = Div(["This is a modal"]);

// if (modalRootElement) {
//   Portal(myModalContent, modalRootElement);
// }
```
---
