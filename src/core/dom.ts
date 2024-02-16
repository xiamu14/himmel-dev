import HNode, { HChildren } from "./HNode";
import ImgNode from "./ImgNode";
import LinkNode from "./LinkNode";
import { UlNode } from "./ListNode";

export function Div(children?: HChildren<string>) {
  return new HNode(children);
}

export function Ul() {
  const node = new UlNode();
  return node;
}

export function Li(children?: HChildren<string>) {
  const node = new HNode(children);
  node.as("li");
  return node;
}

export function Text(children?: HChildren<string>) {
  const node = new HNode(children);
  node.as("p");
  return node;
}

export function Link(children?: string) {
  const node = new LinkNode(children);
  return node as Omit<LinkNode, "as">;
}

export function Img(src: string) {
  const node = new ImgNode();
  node.src(src);
  return node;
}

// 特殊
class RootNode extends HNode<unknown, HTMLElement> {
  constructor(container: HTMLElement) {
    super();
    this.element = container;
    this.status = "mounted";
    return this;
  }
}

export const createRoot = (
  containerId: string,
  Main: () => HNode<unknown, HTMLElement>
) => {
  const containerElement = document.querySelector(containerId) as HTMLElement;
  if (!containerElement) {
    throw new Error("no container, nothing render");
  }
  Main().mount(new RootNode(containerElement));
};
