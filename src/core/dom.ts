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

export function Button(children?: HChildren) {
  const node = new HNode(children);
  node.as("button");
  return node;
}

export function Text(children?: HChildren) {
  const node = new HNode<HTMLParagraphElement>(children);
  node.as("p");
  return node;
}

export function Span(children?: HChildren) {
  const node = new HNode<HTMLSpanElement>(children);
  node.as("span");
  return node;
}

export function H1(children?: HChildren) {
  const node = new HNode<HTMLHeadingElement>(children);
  node.as("h1");
  return node;
}

export function H2(children?: HChildren) {
  const node = new HNode<HTMLHeadingElement>(children);
  node.as("h2");
  return node;
}

export function H3(children?: HChildren) {
  const node = new HNode<HTMLHeadingElement>(children);
  node.as("h3");
  return node;
}

export function H4(children?: HChildren) {
  const node = new HNode<HTMLHeadingElement>(children);
  node.as("h4");
  return node;
}

export function H5(children?: HChildren) {
  const node = new HNode<HTMLHeadingElement>(children);
  node.as("h5");
  return node;
}

export function H6(children?: HChildren) {
  const node = new HNode<HTMLHeadingElement>(children);
  node.as("h5");
  return node;
}

export function Hr() {
  const node = new HNode<HTMLHRElement>();
  node.as("hr");
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
class RootNode extends HNode<HTMLDivElement> {
  constructor(container: HTMLDivElement) {
    super();
    this.element = container;
    this.status = "mounted";
    return this;
  }
}

export const createRoot = (
  containerId: string,
  Main: () => HNode<HTMLDivElement>
) => {
  const containerElement = document.querySelector(
    containerId
  ) as HTMLDivElement;
  if (!containerElement) {
    throw new Error("no container, nothing render");
  }
  Main().mount(new RootNode(containerElement));
};
