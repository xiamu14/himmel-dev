import HNode, { HChildren } from "./HNode";
import ImgNode from "./ImgNode";
import LinkNode from "./LinkNode";
import ListNode from "./ListNode";
import { observerHelper } from "./signal";

export function Div(children?: HChildren<string>) {
  return new HNode(children);
}

export function List<T>(
  children?: HNode<T, HTMLElement>[] | (() => HNode<T, HTMLElement>[])
) {
  let node: ListNode;

  if (typeof children === "function") {
    node = observerHelper.bind(
      () => {
        // TODO: diff children for reduce operation
        node.children = children();
        // TODO: optimize diff
        if (node.element && node.status === "mounted") {
          node.element!.innerHTML = "";
          node.renderChildren();
        }
      },
      () => {
        return new ListNode(children());
      }
    );
  } else {
    node = new ListNode(children);
  }

  return node;
}

export function Item(children?: HChildren<string>) {
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
