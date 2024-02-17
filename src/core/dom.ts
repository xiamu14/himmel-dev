import HNode, { HChildren, ListChildrenBuilder } from "./HNode";
import ImgNode from "./ImgNode";
import LinkNode from "./LinkNode";

export function Div(children?: HChildren) {
  return new HNode<HTMLDivElement>(children);
}

export function List<Item, E extends HTMLElement>(
  builder: ListChildrenBuilder<Item, E>
) {
  const node = new HNode<E>();
  return node.build(builder);
}

export function Li(children?: HChildren) {
  const node = new HNode(children);
  node.as("li");
  return node;
}

export function Text(children?: HChildren) {
  const node = new HNode<HTMLParagraphElement>(children);
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
class RootNode extends HNode<HTMLElement> {
  constructor(container: HTMLElement) {
    super();
    this.element = container;
    this.status = "mounted";
    return this;
  }
}

export const createRoot = (
  containerId: string,
  Main: () => HNode<HTMLElement>
) => {
  const containerElement = document.querySelector(containerId) as HTMLElement;
  if (!containerElement) {
    throw new Error("no container, nothing render");
  }
  Main().mount(new RootNode(containerElement));
};
