export type HNodeStatus = "idle" | "mounted" | "unmounted";
export type Style = Partial<CSSStyleDeclaration>;
export type Attributes = {
  class: string;
  hide: boolean;
  style: Style;
  href?: string;
  src?: string;
};
export type NodeRef = HTMLElement | undefined;
export type GetNodeRef = (ref: HTMLElement | undefined) => void;
export type Hooks = {
  onMount?: () => void;
  onWillMount?: () => void;
  onUnmount?: () => void;
  onWillUnmount?: () => void;
};
