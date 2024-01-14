import HNode, { HChildren } from "./HNode";

export function Div(children?: HChildren<string>) {
  return new HNode(children);
}

export function P(children?: HChildren<string>) {
  const node = new HNode(children);
  node.as("p");
  return node;
}

function render(container: HTMLElement, element: HNode<unknown> | undefined) {
  if (!element) return;
  const dom = document.createElement(element.type);
  dom;
  //  ... 处理其他 attr

  container.appendChild(dom);
  let children = element
    ? !Array.isArray(element.children)
      ? [element.children]
      : element.children
    : [];

  children.forEach((child) => {
    if (typeof child === "string") {
      dom.innerText = child;
    } else {
      render(dom, child);
    }
  });
}

export const createRoot = (
  containerId: string,
  RootNode: () => HNode<unknown>
) => {
  const containerElement = document.querySelector(containerId) as HTMLElement;
  if (!containerElement) {
    throw new Error("no container, nothing render");
  }
  render(containerElement, RootNode());
};
