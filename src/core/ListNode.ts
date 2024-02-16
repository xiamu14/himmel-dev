import HNode from "./HNode";

export class UlNode<T, E extends HTMLElement> extends HNode<T, E> {
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

export class OlNode<T, E extends HTMLElement> extends HNode<T, E> {
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
