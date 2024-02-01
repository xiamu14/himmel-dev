import HNode, { HChildren } from "./HNode";
import LinkNode from "./LinkNode";

export function Div(children?: HChildren<string>) {
  return new HNode(children);
}

export function Text(children?: HChildren<string>) {
  const node = new HNode(children);
  node.as("p");
  return node;
}

export function Link(children?: string) {
  const node = new LinkNode(children);
  console.log("test", node.type, node.element);
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
