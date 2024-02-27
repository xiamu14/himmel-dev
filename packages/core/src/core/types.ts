import HNode from "./HNode";

export type HNodeStatus = "idle" | "mounted" | "unmounted";
export type Style = Partial<CSSStyleDeclaration>;
export type Attributes = {
  class: string;
  hide: boolean;
  style: Style;
  simpleAttrs: SimpleAttributes;
};

type AttrDataName = `data-${string}`;

type ImageAttributes = {
  href?: string;
  src?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  alt?: string;
};

export type SimpleAttributes = {
  id?: string;
  type?: string;
  contentEditable?: boolean;
  value?: string;
  [k: AttrDataName]: string;
} & ImageAttributes;

export type NodeRef = HTMLElement | undefined;
export type GetNodeRef<E extends HTMLElement> = (ref: HNode<E>) => void;
export type Hooks = {
  onMount?: () => void;
  onWillMount?: () => void;
  onUnmount?: () => void;
  onWillUnmount?: () => void;
};

export type UniqueId = string;
export type Patch = {
  add: UniqueId[];
  remove: UniqueId[];
  unChange: UniqueId[];
  changed: UniqueId[];
};

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
