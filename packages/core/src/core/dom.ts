import HNode, { HChildren, ListChildrenBuilder } from "./HNode";
import ImgNode from "./ImgNode";
import InputNode from "./InputNode";
import LinkNode from "./LinkNode";

export function Div(children?: HChildren) {
  return new HNode<HTMLDivElement>(children);
}

export function Input() {
  return new InputNode();
}

export function List<Item, E extends HTMLElement>(
  builder: ListChildrenBuilder<Item, E>
) {
  const node = new HNode<E>();
  return node.build(builder);
}

export function Li(children?: HChildren) {
  const node = new HNode(children);

  node.type = "li";
  return node;
}

export function Button(children?: HChildren) {
  const node = new HNode(children);
  node.type = "button";
  return node;
}

export function Text(children?: HChildren) {
  const node = new HNode<HTMLParagraphElement>(children);
  node.type = "p";
  return node;
}

export function Span(children?: HChildren) {
  const node = new HNode<HTMLSpanElement>(children);
  node.type = "span";
  return node;
}

export function H1(children?: HChildren) {
  const node = new HNode<HTMLHeadingElement>(children);
  node.type = "h1";
  return node;
}

export function H2(children?: HChildren) {
  const node = new HNode<HTMLHeadingElement>(children);
  node.type = "h2";
  return node;
}

export function H3(children?: HChildren) {
  const node = new HNode<HTMLHeadingElement>(children);
  node.type = "h3";
  return node;
}

export function H4(children?: HChildren) {
  const node = new HNode<HTMLHeadingElement>(children);
  node.type = "h4";
  return node;
}

export function H5(children?: HChildren) {
  const node = new HNode<HTMLHeadingElement>(children);
  node.type = "h5";
  return node;
}

export function H6(children?: HChildren) {
  const node = new HNode<HTMLHeadingElement>(children);
  node.type = "h5";
  return node;
}

export function Hr() {
  const node = new HNode<HTMLHRElement>();
  node.type = "hr";
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
class RootNode<E extends HTMLElement> extends HNode<E> {
  constructor(container: E) {
    super();
    this.element = container;
    this.status = "mounted";
    return this;
  }
}

export const createRoot = <E extends HTMLElement>(
  containerId: string,
  Main: () => HNode<E>
) => {
  const containerElement = document.querySelector(containerId) as HTMLElement;
  if (!containerElement) {
    throw new Error("no container, nothing render");
  }
  Main().mount(new RootNode(containerElement));
};

export const Portal = <E extends HTMLElement, PE extends HTMLElement>(
  node: HNode<E>,
  mount: HNode<PE> | HTMLElement
) => {
  if (mount instanceof HNode) {
    node.mount(mount);
  } else {
    node.mount(new RootNode(mount));
  }
};
