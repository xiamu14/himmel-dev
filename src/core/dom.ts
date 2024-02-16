import { diff } from "fast-array-diff";
import HNode, { HChildren, ListChild } from "./HNode";
import ImgNode from "./ImgNode";
import LinkNode from "./LinkNode";
import ListNode from "./ListNode";
import { observerHelper } from "./signal";
import { UniqueId } from "./types";

export function Div(children?: HChildren<string>) {
  return new HNode(children);
}

export function List<T, I extends { key: UniqueId }, E extends HTMLElement>(
  data: I[] | (() => I[]),
  children: (item: I, index: number) => ListChild<T, E>
) {
  let node: ListNode<T, E>;
  let prevData: I[] = [];
  if (typeof data === "function") {
    node = observerHelper.bind(
      () => {
        // TODO: diff children for reduce operation
        const nextData = data();
        const patch = diff(
          prevData,
          nextData,
          (old, current) => old.key === current.key
        );
        console.log("patch", patch);
        // diff prevData, nextData
        // TODO: List 只处理删除，新增，顺序修改等
        patch.removed.map((item) => {
          const index = (node.children as ListChild<T, E>[]).findIndex((it) => {
            if (it instanceof HNode) {
              return it.getKey() === item.key;
            }
            return -1;
          });
        });
        // TODO: optimize diff
        node.patchChildren();
        prevData = nextData;
      },
      () => {
        const dataSource = data();
        prevData = dataSource;
        return new ListNode(dataSource.map(children));
      }
    );
  } else {
    node = new ListNode<T, E>(data.map(children));
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
