export type HNodeStatus = "idle" | "mounted" | "unmounted";
export type Style = Partial<CSSStyleDeclaration>;
export type Attributes = {
  class: string;
  hide: boolean;
  style: Style;
  simpleAttrs: SimpleAttributes;
};
export type SimpleAttributes = {
  id?: string;
  href?: string;
  src?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  alt?: string;
  contentEditable?: boolean;
};

export type NodeRef = HTMLElement | undefined;
export type GetNodeRef = (ref: HTMLElement | undefined) => void;
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
