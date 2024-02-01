import HNode from "./HNode";
import { effectObserverObject } from "./signal";

export default class LinkNode extends HNode<string> {
  constructor(children?: string) {
    super(children);
    this.type = "a";
  }
  href(val: string | (() => string)) {
    if (typeof val === "function") {
      effectObserverObject.observer = () => {
        this.element && this.element.setAttribute("href", val());
      };
      this.attributes.href = val();
    } else {
      this.attributes.href = val;
    }
    return this;
  }
  /**
   * @description forbidden override type of LinkNode
   */
  as() {}
}
