# Himmel Demo Documentation

This package provides a demonstration application built using the `himmel` core library. It showcases how to use various features of Himmel to build a reactive web UI.

## Purpose

The primary purpose of this demo is to:
- Illustrate the practical application of `himmel` core concepts like signals, components (`HNodes`), and event handling.
- Provide example code that developers can refer to when building their own Himmel applications.
- Serve as a testbed for `himmel` features during development.

## Overview of the Demo Application

The demo application showcases several key features of Himmel:

- **Basic Component Structure:** The `App` function in `src/main.ts` serves as the root component.
- **Reactivity with Signals:**
    - A counter (`countSignal`) is implemented with a button to increment its value. The button text dynamically updates using `get(countSignal)`.
    - An input field (`inputValueSignal`) demonstrates two-way data binding: typing in the input updates the signal, and a `Text` component displays the signal's current value.
- **DOM Element Creation:** Various components like `Div`, `Button`, `H1`, `Img`, `Input`, and `Text` are used to structure the application.
- **Event Handling:**
    - `.onClick()` is used for button interactions (increment counter, show modal).
    - `.onInput()` is used to capture changes from the text input.
- **Conditional Rendering:**
    - A modal dialog is implemented using a `Portal`. Its visibility is controlled by a `hideSignal` and the `.hide()` method on the portal's root `Div`.
- **Styling:**
    - The demo uses CSS classes for styling, including integration with UnoCSS (`virtual:uno.css`).
    - Dynamic class names can also be applied (shown in examples in the main project `README.md`).
- **Dynamic Lists (Conceptual - from root README example):**
    - The `List` component can be used to render dynamic arrays of data. An example `TodoList` (seen in the main project `README.md`) demonstrates how to render a list of strings and update it over time using `dispatch` on a signal containing an array.
- **Lifecycle Hooks & Refs (Conceptual - from root README example):**
    - Examples in the main project `README.md` (the `Hello` component) show usage of `.ref()` with `createNodeRef` to get references to HNodes, and lifecycle hooks like `.onMount()`, `.onWillUnmount()`, etc.

The demo provides a simple yet effective way to see these Himmel features in action.

## Running the Demo

To run the demo application locally:
1. Ensure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.
2. Clone the repository (if you haven't already).
3. Install dependencies from the root of the monorepo: `pnpm install`
4. Run the demo development server: `pnpm demo:dev` (This script is defined in the root `package.json`)
5. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173` or a similar port).

---
