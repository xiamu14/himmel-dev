import { diff } from "fast-array-diff";

import { observerHelper } from "./signal";
import {
  Attributes,
  GetNodeRef,
  HNodeStatus,
  Hooks,
  SimpleAttributes,
  Style,
  UniqueId,
} from "./types";
import { debug, uniqueId } from "./utils";

export function createNodeRef<E extends HTMLElement>(): [
  { node?: HNode<E> },
  GetNodeRef<E>
] {
  const obj: { node?: HNode<E> } = {
    node: undefined,
  };
  return [
    obj,
    (ref: HNode<E>) => {
      obj.node = ref;
    },
  ];
}

export type ListChildrenBuilder<Item extends unknown, E extends HTMLElement> = {
  data: () => Item[];
  key: (item: Item, index: number) => UniqueId;
  item: (item: Item, index: number) => HNode<E>;
};

export type HChildren =
  | string
  | number
  | HNode<HTMLElement>
  | HNode<HTMLElement>[]
  | (() => string | number); // 响应式数组需要使用 builder 模式，支持 patch render

export type ListChild<E extends HTMLElement> = string | number | HNode<E>;

export default class HNode<E extends HTMLElement> {
  type: string;
  status: HNodeStatus = "idle";
  children: HChildren | undefined;
  element: E | undefined;
  parentNode: HNode<HTMLElement> | undefined;
  index: number | undefined = undefined; // 当前 Node 在父组件里的位置
  container: HTMLElement | undefined;
  attributes: Attributes = {
    hide: false,
    class: "",
    style: {},
    simpleAttrs: {},
  };
  hooks: Hooks = {};
  events: Record<string, any> = {};
  _key = uniqueId();
  _prevPatchDataSource: unknown[] = [];
  _prevPatchChildren: HNode<E>[] = [];
  _builder: ListChildrenBuilder<any, E> | undefined;

  _dev?: boolean = false;

  public dev() {
    this._dev = true;
    return this;
  }

  public build<Item>(builder: ListChildrenBuilder<Item, E>) {
    this._builder = builder;
    return this;
  }

  public getKey() {
    return this._key;
  }

  constructor(children?: HChildren) {
    this.type = "div";
    this.children = children;
  }

  createElement(period: "mount" | "remount") {
    debug(this._dev)(period);
    const element = document.createElement(this.type) as E;
    this.element = element;

    // 处理 attributes
    this.attributes.class &&
      this.element.classList.add(...this.attributes.class.split(" "));

    // 处理 style
    Object.assign(this.element.style, this.attributes.style);

    Object.keys(this.attributes.simpleAttrs).forEach((name) => {
      const value = this.attributes.simpleAttrs[name as keyof SimpleAttributes];
      value && this.element?.setAttribute(name, String(value));
    });

    if (this.events.click) {
      this.element.onclick = this.events.click;
    }
    // NOTE: create and append
    if (this.parentNode?.status === "mounted") {
      this.hooks?.onWillMount?.();

      if (!(typeof this.index === "number")) {
        this.parentNode.element!.appendChild(this.element!);
      } else {
        const childNodes = this.parentNode.element!.childNodes;
        const preNode = childNodes[this.index];
        this.parentNode.element!.insertBefore(this.element, preNode);
      }
      this.status = "mounted";
      this.hooks?.onMount?.();
    }
  }

  mount(parentNode: HNode<HTMLElement>) {
    this.parentNode = parentNode;
    // try to record the index
    if (this.parentNode.status === "mounted") {
      const childNodes = this.parentNode.element!.childNodes;
      this.index = childNodes.length ?? 0;
    }
    if (this.attributes.hide || this.parentNode.status !== "mounted") {
      this.status = "unmounted";
      return null;
    }

    this.createElement("mount");
    this.renderChildren();
    return true;
  }

  renderChildren() {
    if (this._builder && this.children === undefined) {
      debug(this._dev)("patchRender");
      this.patchRenderChildren(this._builder);
    } else {
      const children = !Array.isArray(this.children)
        ? [this.children]
        : this.children;
      for (const child of children) {
        if (child !== undefined) {
          if (typeof child === "function") {
            // 响应式
            observerHelper.bind(
              () => {
                if (this.element) {
                  this.element.innerText = String(child());
                }
              },
              () => {
                // 初始化
                this.element!.innerText = String(child());
              }
            );
          } else if (child instanceof HNode) {
            child.mount(this);
          } else {
            this.element!.innerText = String(child);
          }
        }
      }
    }
  }

  // TODO:对子组件数组实现 patch 更新
  patchRenderChildren(builder: ListChildrenBuilder<any, E>) {
    observerHelper.bind(
      () => {
        const newPatchDataSource = builder.data();
        const newPatchChildren: HNode<E>[] = this._prevPatchChildren;
        const diffData = diff(
          this._prevPatchDataSource,
          newPatchDataSource,
          (old, latest) => {
            const oldIndex = this._prevPatchDataSource.findIndex(
              (it) => it === old
            );
            const oldKey = builder.key(old, oldIndex);
            const latestIndex = newPatchDataSource.findIndex(
              (it) => it === latest
            );
            const latestKey = builder.key(latest, latestIndex);
            return oldKey === latestKey;
          }
        );
        // according to diffData to render children by patch
        console.log(
          "diffData",
          this._prevPatchDataSource,
          newPatchDataSource,
          diffData
        );
        // TODO: remove child
        diffData.removed.forEach((item) => {
          // TODO: 找出被删除的数据的 key
          const index = this._prevPatchDataSource.findIndex(
            (it) => it === item
          );
          const key = builder.key(item, index);
          // TODO: 通过 key 找出对应的 HNode
          const child = this._prevPatchChildren.find((item) => {
            return item._key === key;
          });
          if (child) {
            child.unmount();
            newPatchChildren.splice(index, 1);
          }
        });
        diffData.added.forEach((item) => {
          const index = newPatchDataSource.findIndex((it) => it === item);
          const key = builder.key(item, index);
          const child = builder.item(item, index);
          child.index = index;
          child._key = key;
          child.mount(this);
          newPatchChildren.splice(index, 0, child);
        });
        // TODO: 调整顺序
        newPatchDataSource.forEach((item, index) => {
          const key = builder.key(item, index);
          const child = newPatchChildren.find((it) => it._key === key);
          debug(this._dev)("sort", child, child?.index, index);
          if (child && child.index !== undefined && child.index !== index) {
            if (index === newPatchDataSource.length - 1) {
              child.parentNode?.element?.appendChild(child.element!);
            } else {
              const afterElement = child.parentNode?.element?.childNodes[index];
              child.parentNode?.element?.insertBefore(
                child.element!,
                afterElement!
              );
            }
            child.index = index;

            newPatchChildren.splice(child.index, 1);
            newPatchChildren.splice(index, 0, child);
          }
        });
        this._prevPatchDataSource = newPatchDataSource;
        this._prevPatchChildren = newPatchChildren;
      },
      () => {
        const newPatchDataSource = builder.data();
        for (let [index, item] of newPatchDataSource.entries()) {
          const child = builder.item(item, index);
          child._key = builder.key(item, index);
          child.index = index;
          this._prevPatchChildren.push(child);
          child.mount(this);
        }
      }
    );
  }

  unmount() {
    if (
      this.parentNode?.status === "mounted" &&
      this.element &&
      this.status === "mounted"
    ) {
      this.hooks?.onWillUnmount?.();
      this.parentNode.element!.removeChild(this.element);
      this.status = "unmounted";
      this.element = undefined;
      this.hooks?.onUnmount?.();
    }
  }

  remount() {
    this.createElement("remount");
    this.renderChildren();
  }

  className(val: string | (() => string)) {
    if (typeof val === "function") {
      observerHelper.bind(
        (old?: string) => {
          if (old) {
            [...old.split(" ")].forEach((it) => {
              this.element?.classList.remove(it);
            });
          }
          this.element?.classList.add(...val().split(" "));
        },
        () => {
          this.attributes.class = val();
        }
      );
    } else {
      this.attributes.class = val;
    }
    return this;
  }
  attrs(simpleAttrs: SimpleAttributes) {
    this.attributes.simpleAttrs = Object.assign(
      {},
      this.attributes.simpleAttrs,
      simpleAttrs
    );
    return this;
  }
  style(val: Style | (() => Style)) {
    if (typeof val === "function") {
      observerHelper.bind(
        () => {
          this.element && Object.assign(this.element, val());
        },
        () => {
          this.attributes.style = val();
        }
      );
    } else {
      this.attributes.style = val;
    }
    return this;
  }
  as(type: string) {
    this.type = type;
    return this;
  }
  ref(fn: GetNodeRef<E>) {
    fn(this);
    return this;
  }
  hide(val: boolean | (() => boolean)) {
    if (typeof val === "function") {
      observerHelper.bind(
        () => {
          val() ? this.unmount() : this.remount();
        },
        () => {
          this.attributes.hide = val();
        }
      );
    } else {
      this.attributes.hide = val;
    }
    return this;
  }
  onClick(handle: (event?: MouseEvent) => void) {
    this.events.click = handle;
    return this;
  }
  onWillMount(fn: () => void) {
    this.hooks.onWillMount = fn;
    return this;
  }
  onMount(fn: () => void) {
    this.hooks.onMount = fn;
    return this;
  }
  onUnmount(fn: () => void) {
    this.hooks.onUnmount = fn;
    return this;
  }
  onWillUnmount(fn: () => void) {
    this.hooks.onWillUnmount = fn;
    return this;
  }
}
