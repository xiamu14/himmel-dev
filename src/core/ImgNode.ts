import HNode from "./HNode";
import { effectObserverObject } from "./signal";

export default class ImgNode extends HNode<string> {
  constructor() {
    super();
    this.type = "img";
  }
  src(val: string | (() => string)) {
    if (typeof val === "function") {
      effectObserverObject.observer = () => {
        this.element && this.element.setAttribute("src", val());
      };
      this.attributes.src = val();
    } else {
      this.attributes.src = val;
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
