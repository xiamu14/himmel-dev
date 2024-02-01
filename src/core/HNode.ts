import { effectObserverObject } from "./signal";
import { Attributes, GetNodeRef, HNodeStatus, NodeRef, Style } from "./types";

export function createNodeRef(): [{ node: NodeRef }, GetNodeRef] {
  const obj: { node: NodeRef } = {
    node: undefined,
  };
  return [
    obj,
    (ref: HTMLElement | undefined) => {
      obj.node = ref;
    },
  ];
}

export type HChildren<T> = string | HNode<T> | HNode<T>[] | (() => string);
export default class HNode<T> {
  type: string;
  status: HNodeStatus = "idle";
  children: HChildren<T> | undefined;
  element: HTMLElement | undefined;
  parentNode: HNode<unknown> | undefined;
  container: HTMLElement | undefined;
  attributes: Attributes = {
    hide: false,
    class: "",
    style: {},
  };
  getNodeRef?: GetNodeRef;
  constructor(children?: HChildren<T>) {
    this.type = "div";
    this.children = children;
  }

  createElement() {
    const element = document.createElement(this.type);
    this.element = element;

    // 处理 attributes
    this.attributes.class &&
      this.element.classList.add(...this.attributes.class.split(" "));

    // 处理 style
    Object.assign(this.element.style, this.attributes.style);
    // 处理 href
    this.attributes.href &&
      this.element.setAttribute("href", this.attributes.href);
    // TODO：处理 event handler
    // NOTE: create and append
    if (this.parentNode?.status === "mounted") {
      this.parentNode.element?.appendChild(this.element!);
      this.getNodeRef?.(this.element);
      this.status = "mounted";
    }
  }

  mount(parentNode: HNode<unknown>) {
    this.parentNode = parentNode;
    if (this.attributes.hide || this.parentNode.status !== "mounted") {
      this.status = "unmounted";
      return null;
    }
    this.createElement();
    this.renderChildren();
  }

  renderChildren() {
    const children = !Array.isArray(this.children)
      ? [this.children]
      : this.children;
    for (const child of children) {
      if (child !== undefined) {
        if (typeof child === "string") {
          this.element!.innerText = child;
        } else if (typeof child === "function") {
          // 响应式
          effectObserverObject.observer = () => {
            if (this.element) {
              this.element.innerText = child();
            }
          };
          // 初始化
          this.element!.innerText = child();
        } else {
          (child as HNode<unknown>).mount(this);
        }
      }
    }
  }

  unmount() {
    if (
      this.parentNode?.status === "mounted" &&
      this.element &&
      this.status === "mounted"
    ) {
      this.parentNode.element!.removeChild(this.element);
      this.status = "unmounted";
      this.element = undefined;
      this.getNodeRef?.(undefined);
    }
  }

  remount() {
    this.createElement();
    this.renderChildren();
  }

  className(val: string | (() => string)) {
    if (typeof val === "function") {
      effectObserverObject.observer = () => {
        this.element?.classList.add(...val().split(" "));
      };
      this.attributes.class = val();
    } else {
      this.attributes.class = val;
    }
    return this;
  }
  style(val: Style | (() => Style)) {
    if (typeof val === "function") {
      effectObserverObject.observer = () => {
        this.element && Object.assign(this.element, val());
      };
      this.attributes.style = val();
    } else {
      this.attributes.style = val;
    }
    return this;
  }
  as(type: string) {
    this.type = type;
  }
  ref(fn: GetNodeRef) {
    this.getNodeRef = fn;
    return this;
  }
  hide(val: boolean | (() => boolean)) {
    if (typeof val === "function") {
      effectObserverObject.observer = () => {
        val() ? this.remount() : this.unmount();
      };
      this.attributes.hide = val();
    } else {
      this.attributes.hide = val;
    }
    return this;
  }
}
