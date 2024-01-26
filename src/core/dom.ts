import HNode, { HChildren } from "./HNode";

export function Div(children?: HChildren<string>) {
  return new HNode(children);
}

export function P(children?: HChildren<string>) {
  const node = new HNode(children);
  node.as("p");
  return node;
}

export const createRoot = (
  containerId: string,
  RootNode: () => HNode<unknown>
) => {
  const containerElement = document.querySelector(containerId) as HTMLElement;
  if (!containerElement) {
    throw new Error("no container, nothing render");
  }
  RootNode().createElement(containerElement);
};
