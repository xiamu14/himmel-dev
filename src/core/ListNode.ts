import HNode, { HChildren } from "./HNode";

export default class ListNode extends HNode<string, HTMLUListElement> {
  constructor(children?: HChildren<unknown>) {
    super(children);
    this.type = "ul";
  }

  /**
   * @description forbidden override type of LinkNode
   */
  as(type: "ol") {
    this.type = type;
    return this;
  }
}
