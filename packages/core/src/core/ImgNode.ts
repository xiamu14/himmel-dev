import HNode from "./HNode";
import { observerHelper } from "./signal";

export default class ImgNode extends HNode<HTMLImageElement> {
  constructor() {
    super();
    this.type = "img";
  }
  src(val: string | (() => string)) {
    if (typeof val === "function") {
      observerHelper.bind(
        () => {
          this.element && this.element.setAttribute("src", val());
        },
        () => {
          this.attributes.simpleAttrs.src = val();
        }
      );
    } else {
      this.attributes.simpleAttrs.src = val;
    }
    return this;
  }
}
