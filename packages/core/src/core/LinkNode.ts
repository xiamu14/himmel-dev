import HNode, { HChildren } from "./HNode";
import { observerHelper } from "./signal";

export default class LinkNode extends HNode<HTMLLinkElement> {
  constructor(children?: HChildren) {
    super(children);
    this.type = "a";
  }
  href(val: string | (() => string)) {
    if (typeof val === "function") {
      // observerHelper.observer = () => {
      //   this.element && this.element.setAttribute("href", val());
      // };
      // this.attributes.href = val();
      observerHelper.bind(
        () => {
          this.element && this.element.setAttribute("href", val());
        },
        () => {
          this.attributes.simpleAttrs.href = val();
        }
      );
    } else {
      this.attributes.simpleAttrs.href = val;
    }
    return this;
  }
  /**
   * @description forbidden override type of LinkNode
   */
  as() {
    return this;
  }
}
