export type HChildren<T> = string | HNode<T> | HNode<T>[];
export default class HNode<T> {
  type: string;
  children: HChildren<T> | undefined;
  constructor(children?: HChildren<T>) {
    this.type = "div";
    this.children = children;
  }
  className() {}
  style() {}
  as(type: string) {
    this.type = type;
  }
  hide() {}
  none() {}
  attr({ __dangerousHtml }: { __dangerousHtml?: string }) {}
}
