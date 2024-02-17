import HNode from "./HNode";

export class UlNode<E extends HTMLElement> extends HNode<E> {
  constructor() {
    super();
    this.type = "ul";
  }

  /**
   * @description forbidden override type of LinkNode
   */
  as() {
    return this;
  }
}

export class OlNode<E extends HTMLElement> extends HNode<E> {
  constructor() {
    super();
    this.type = "ol";
  }

  /**
   * @description forbidden override type of LinkNode
   */
  as() {
    return this;
  }
}
