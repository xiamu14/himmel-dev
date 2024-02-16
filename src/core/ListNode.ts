import HNode, { HChildren } from "./HNode";

export default class ListNode<T, E extends HTMLElement> extends HNode<T, E> {
  constructor(children?: (string | number | HNode<T, E>)[]) {
    super(children as HChildren<T>);
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
