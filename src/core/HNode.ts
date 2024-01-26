import { effectObserverObject } from "./signal";

export type HChildren<T> = string | HNode<T> | HNode<T>[];
export default class HNode<T> {
  type: string;
  children: HChildren<T> | undefined;
  element: HTMLElement | undefined;
  parentNode: HTMLElement | undefined;
  attrHide: boolean = false;
  attrClass: string = "";
  constructor(children?: HChildren<T>) {
    this.type = "div";
    this.children = children;
  }
  createElement(container: HTMLElement) {
    const element = document.createElement(this.type);
    this.parentNode = container;
    this.element = element;
    !this.attrHide && container.appendChild(element);
    console.log("[aaa]", this.attrClass);
    this.attrClass && this.element.classList.add(...this.attrClass.split(" "));

    const children = !Array.isArray(this.children)
      ? [this.children]
      : this.children;
    for (const child of children) {
      if (child !== undefined) {
        if (typeof child === "string") {
          element.innerText = child;
        } else {
          (child as HNode<unknown>).createElement(element);
        }
      }
    }
  }

  className(val: string | (() => string)) {
    if (typeof val === "function") {
      effectObserverObject.observer = () => {
        if (this.element) {
          this.element.classList.add(...val().split(" "));
        }
      };
      // DEBUG
      this.attrClass = val();
    } else {
      this.attrClass = val;
    }
    return this;
  }
  style() {}
  as(type: string) {
    this.type = type;
  }
  hide(val: boolean | (() => boolean)) {
    if (typeof val === "function") {
      effectObserverObject.observer = () => {
        console.log("xxx", val, this.element, this.parentNode);
        if (this.element && this.parentNode) {
          val()
            ? this.parentNode.removeChild(this.element)
            : this.parentNode.appendChild(this.element);
        }
      };
      // DEBUG
      this.attrHide = val();
    } else {
      this.attrHide = val;
    }
    return this;
  }
  attr({ __dangerousHtml }: { __dangerousHtml?: string }) {}
}
