import { observerHelper } from "./signal";
import {
  Attributes,
  GetNodeRef,
  HNodeStatus,
  Hooks,
  NodeRef,
  Style,
} from "./types";

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
  index: number | undefined = undefined;
  container: HTMLElement | undefined;
  attributes: Attributes = {
    hide: false,
    class: "",
    style: {},
  };
  hooks: Hooks = {};
  events: Record<string, any> = {};
  getNodeRef?: GetNodeRef;
  constructor(children?: HChildren<T>) {
    this.type = "div";
    this.children = children;
  }

  createElement(period: "mount" | "remount") {
    const element = document.createElement(this.type);
    this.element = element;

    // 处理 attributes
    this.attributes.class &&
      this.element.classList.add(...this.attributes.class.split(" "));

    // 处理 style
    Object.assign(this.element.style, this.attributes.style);
    // 处理 href
    this.attributes.href &&
      this.type === "a" &&
      this.element.setAttribute("href", this.attributes.href);

    // 处理 src
    this.attributes.src &&
      this.type === "img" &&
      this.element.setAttribute("src", this.attributes.src);

    if (this.events.click) {
      this.element.onclick = this.events.click;
    }
    // NOTE: create and append
    if (this.parentNode?.status === "mounted") {
      this.hooks?.onWillMount?.();

      console.log("index0", this.index, period);
      if (!(typeof this.index === "number")) {
        this.parentNode.element!.appendChild(this.element!);
      } else {
        const childNodes = this.parentNode.element!.childNodes;
        const preNode = childNodes[this.index];
        console.log("preNode", preNode);
        this.parentNode.element!.insertBefore(this.element, preNode);
      }
      console.log("index1", this.index, period);
      this.getNodeRef?.(this.element);
      this.status = "mounted";
      this.hooks?.onMount?.();
    }
  }

  mount(parentNode: HNode<unknown>) {
    this.parentNode = parentNode;
    // TODO:NOTE: try to record the index
    if (this.parentNode.status === "mounted") {
      const childNodes = this.parentNode.element!.childNodes;
      this.index = childNodes.length ?? 0;
    }
    if (this.attributes.hide || this.parentNode.status !== "mounted") {
      this.status = "unmounted";
      return null;
    }

    this.createElement("mount");
    this.renderChildren();
    return true;
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
          // observerHelper.observer = () => {
          //   if (this.element) {
          //     this.element.innerText = child();
          //   }
          // };
          // // 初始化
          // this.element!.innerText = child();
          observerHelper.bind(
            () => {
              if (this.element) {
                this.element.innerText = child();
              }
            },
            () => {
              // 初始化
              this.element!.innerText = child();
            }
          );
        } else {
          (child as HNode<unknown>).mount(this);
        }
      }
    }
  }

  unmount() {
    console.log(
      "%c status",
      "color:white;background: #18a0f1;padding:4px",
      this
    );
    if (
      this.parentNode?.status === "mounted" &&
      this.element &&
      this.status === "mounted"
    ) {
      this.hooks?.onWillUnmount?.();
      this.parentNode.element!.removeChild(this.element);
      this.status = "unmounted";
      this.element = undefined;
      this.getNodeRef?.(undefined);
      this.hooks?.onUnmount?.();
    }
  }

  remount() {
    //TODO: need remember the path on dom tree
    this.createElement("remount");
    this.renderChildren();
  }

  className(val: string | (() => string)) {
    if (typeof val === "function") {
      // observerHelper.observer = (old?: string) => {
      //   if (old) {
      //     console.log(
      //       "%c old",
      //       "color:white;background: #18a0f1;padding:4px",
      //       old
      //     );
      //     [...old.split(" ")].forEach((it) => {
      //       this.element?.classList.remove(it);
      //     });
      //   }
      //   this.element?.classList.add(...val().split(" "));
      // };
      // this.attributes.class = val();
      observerHelper.bind(
        (old?: string) => {
          if (old) {
            [...old.split(" ")].forEach((it) => {
              this.element?.classList.remove(it);
            });
          }
          this.element?.classList.add(...val().split(" "));
        },
        () => {
          this.attributes.class = val();
        }
      );
    } else {
      this.attributes.class = val;
    }
    return this;
  }
  style(val: Style | (() => Style)) {
    if (typeof val === "function") {
      // observerHelper.observer = () => {
      //   this.element && Object.assign(this.element, val());
      // };
      // this.attributes.style = val();
      observerHelper.bind(
        () => {
          this.element && Object.assign(this.element, val());
        },
        () => {
          this.attributes.style = val();
        }
      );
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
      // observerHelper.observer = () => {
      //   val() ? this.remount() : this.unmount();
      // };
      // this.attributes.hide = val();
      observerHelper.bind(
        () => {
          val() ? this.unmount() : this.remount();
        },
        () => {
          this.attributes.hide = val();
        }
      );
    } else {
      this.attributes.hide = val;
    }
    return this;
  }
  onClick(handle: (event?: MouseEvent) => void) {
    this.events.click = handle;
    return this;
  }
  onWillMount(fn: () => void) {
    this.hooks.onWillMount = fn;
    return this;
  }
  onMount(fn: () => void) {
    this.hooks.onMount = fn;
    return this;
  }
  onUnmount(fn: () => void) {
    this.hooks.onUnmount = fn;
    return this;
  }
  onWillUnmount(fn: () => void) {
    this.hooks.onWillUnmount = fn;
    return this;
  }
}
