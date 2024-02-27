import HNode from "./HNode";
import { HTMLInputTypeAttribute } from "./htmlType";
import { HTMLInputEvent, SimpleAttributes } from "./types";
type Attrs = Omit<SimpleAttributes, "id"> & {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
};
export default class InputNode extends HNode<HTMLInputElement> {
  constructor() {
    super();
    this.type = "input";
  }
  attrs(simpleAttrs: Attrs) {
    this.attributes.simpleAttrs = Object.assign(
      {},
      this.attributes.simpleAttrs,
      simpleAttrs
    );
    return this;
  }
  onInput(handler: (event: HTMLInputEvent) => void) {
    this.events["input"] = handler;
    return this;
  }
}
