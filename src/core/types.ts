export type HNodeStatus = "idle" | "mounted" | "unmounted";
export type Style = Partial<CSSStyleDeclaration>;
export type Attributes = {
  class: string;
  hide: boolean;
  style: Style;
  href?: string;
};
export type NodeRef = HTMLElement | undefined;
export type GetNodeRef = (ref: HTMLElement | undefined) => void;
