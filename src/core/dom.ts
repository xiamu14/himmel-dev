import HNode, { HChildren } from "./HNode";

export function Div(children?: HChildren<string>) {
  return new HNode(children);
}

export function P(children?: HChildren<string>) {
  const node = new HNode(children);
  node.as("p");
  return node;
}

// 特殊
class RootNode extends HNode<unknown> {
  constructor(container: HTMLElement) {
    super();
    this.element = container;
    this.status = "mounted";
    return this;
  }
}

export const createRoot = (containerId: string, Main: () => HNode<unknown>) => {
  const containerElement = document.querySelector(containerId) as HTMLElement;
  if (!containerElement) {
    throw new Error("no container, nothing render");
  }
  Main().mount(new RootNode(containerElement));
};
