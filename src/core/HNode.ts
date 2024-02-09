import { observerHelper } from "./signal";
import {
  Attributes,
  GetNodeRef,
  HNodeStatus,
  Hooks,
  NodeRef,
  SimpleAttributes,
  Style,
} from "./types";
import { debug } from "./utils";

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

export type HChildren<T> =
  | string
  | number
  | HNode<T, HTMLElement>
  | HNode<T, HTMLElement>[]
  | (() => string | number);
export default class HNode<T, Element extends HTMLElement> {
  type: string;
  status: HNodeStatus = "idle";
  children: HChildren<T> | undefined;
  element: Element | undefined;
  parentNode: HNode<unknown, HTMLElement> | undefined;
  index: number | undefined = undefined;
  container: HTMLElement | undefined;
  attributes: Attributes = {
    hide: false,
    class: "",
    style: {},
    simpleAttrs: {},
  };
  hooks: Hooks = {};
  events: Record<string, any> = {};
  getNodeRef?: GetNodeRef;

  _dev?: boolean = false;

  public dev() {
    this._dev = true;
  }

  constructor(children?: HChildren<T>) {
    this.type = "div";
    this.children = children;
  }

  createElement(period: "mount" | "remount") {
    debug(this._dev)(period);
    const element = document.createElement(this.type) as Element;
    this.element = element;

    // 处理 attributes
    this.attributes.class &&
      this.element.classList.add(...this.attributes.class.split(" "));

    // 处理 style
    Object.assign(this.element.style, this.attributes.style);

    Object.keys(this.attributes.simpleAttrs).forEach((name) => {
      const value = this.attributes.simpleAttrs[name as keyof SimpleAttributes];
      value && this.element?.setAttribute(name, String(value));
    });

    if (this.events.click) {
      this.element.onclick = this.events.click;
    }
    // NOTE: create and append
    if (this.parentNode?.status === "mounted") {
      this.hooks?.onWillMount?.();

      if (!(typeof this.index === "number")) {
        this.parentNode.element!.appendChild(this.element!);
      } else {
        const childNodes = this.parentNode.element!.childNodes;
        const preNode = childNodes[this.index];
        this.parentNode.element!.insertBefore(this.element, preNode);
      }
      this.getNodeRef?.(this.element);
      this.status = "mounted";
      this.hooks?.onMount?.();
    }
  }

  mount(parentNode: HNode<unknown, Element>) {
    this.parentNode = parentNode;
    // try to record the index
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
          observerHelper.bind(
            () => {
              if (this.element) {
                this.element.innerText = String(child());
              }
            },
            () => {
              // 初始化
              this.element!.innerText = String(child());
            }
          );
        } else {
          (child as HNode<unknown, Element>).mount(this);
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
      this.hooks?.onWillUnmount?.();
      this.parentNode.element!.removeChild(this.element);
      this.status = "unmounted";
      this.element = undefined;
      this.getNodeRef?.(undefined);
      this.hooks?.onUnmount?.();
    }
  }

  remount() {
    this.createElement("remount");
    this.renderChildren();
  }

  className(val: string | (() => string)) {
    if (typeof val === "function") {
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
  attrs(simpleAttrs: SimpleAttributes) {
    this.attributes.simpleAttrs = Object.assign(
      {},
      this.attributes.simpleAttrs,
      simpleAttrs
    );
    return this;
  }
  style(val: Style | (() => Style)) {
    if (typeof val === "function") {
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
