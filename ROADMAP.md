# Himmel Roadmap

Himmel 的目标不是成为另一个 React，也不是运行 React 组件。

Himmel 要做的是一个适合 AI 生成、开发者容易审查的小型 UI runtime。它应该适合内部工具、插件面板、小型 dashboard、demo、可嵌入 widget 这类场景。

## 核心判断

React 生态已经很成熟，Himmel 不应该正面竞争完整前端应用生态。

Himmel 的价值来自更小、更直接、更容易被 AI 生成和修改的 UI 表达方式：

```ts
Div([
  Text(() => get(title)),
  Button("Run").onClick(runTask),
]).className("panel");
```

这类代码应该满足几个要求：

- 结构清楚，开发者能快速 review。
- 运行时小，行为可预测。
- API 稳定，AI 不容易生成错。
- 出问题时容易定位，不依赖隐藏约定。

## Himmel 的主场

Himmel 的主场不是大型前端应用，而是小型交互界面。

优先场景：

- agent 生成 UI。
- 插件面板。
- 内部工具。
- 小型 dashboard。
- 工作流 widget。
- demo 和 prototype。
- 嵌入到大产品里的独立 widget。

这些场景通常有几个特点：

- UI 面积小，但需要真实交互。
- 状态数量有限，行为应该清楚可测。
- 代码经常由 AI 生成或修改，但最后需要开发者 review。
- 不需要完整 app framework。
- 不需要 React runtime。
- 不依赖大型组件生态。

所以 Himmel 的设计重点应该是：

- AI 好写：API 直接，少隐藏规则，少特殊语法。
- 人好审：组件树清楚，状态读写清楚，事件和生命周期显式。
- runtime 小：只保留必要能力，不把生态问题塞进 core。
- 行为可预测：mount、unmount、hide、List、signal 都要有明确语义和测试。

如果一个项目需要复杂 routing、完整设计系统、大量第三方组件、成熟数据框架、多人长期维护的大型页面，应该优先用 React、Vue、Svelte 这类成熟方案。

Himmel 不应该因为担心生态小，就把 React runtime、React component wrapper 或大型 UI library 拉进来。Himmel 应该把主场做窄，把体验做深。

## v1: Core Runtime

v1 的目标是把 Himmel 自身打稳。先不做 React 兼容，不做 React runtime wrapper，不做 React to Himmel codemod。

v1 成功标准：Himmel 能稳定构建 7 类小型 UI，并且核心 runtime 行为有测试。

### 7 类验证场景

1. Counter
   - 验证 signal、事件、文本更新。

2. Form
   - 验证 input、value、onInput、表单状态。

3. Todo/List
   - 验证 List、key、增删改、排序。

4. Modal/Portal
   - 验证 Portal、hide/remount、生命周期。

5. Async Data View
   - 验证 async dispatch、loading、error、data 状态。

6. SVG
   - 支持基础 SVG 元素、属性、事件、动态属性更新。

7. Canvas
   - 支持 canvas primitive，以及基于生命周期的绘制入口。

### Runtime 重点

- 稳定 `signal/get/dispatch/derive/effect` 的行为。
- 明确依赖收集和订阅清理规则。
- 稳定 `mount/remount/unmount` 生命周期。
- 稳定 `hide` 的语义，避免旧节点、旧订阅、旧事件残留。
- 稳定 `ref` 行为：`ref` 拿到 `HNode`，真实 DOM element 在 mount 后可访问。
- 完善基础 attributes 和 events。
- 完善 List patch 行为，覆盖新增、删除、排序。
- 补测试，先覆盖核心 runtime，再扩展示例测试。

### Animation 边界

v1 不提供官方 animation API。

v1 只保证 runtime 能支撑第三方 animation library 接入：

- `ref` 在 `onMount` 后能稳定访问 DOM element。
- `onUnmount` 能稳定触发，供用户释放第三方资源。
- `hide/remount` 的生命周期行为明确且可测。
- `className/style` 的响应式更新行为明确且可测。

anime.js、motion 或其他 animation library 的接入方式，等 v1 core 稳定后再基于真实 demo 设计。不要提前抽象不可靠的 adapter。

## v2: AI Generation Experience

v2 重点放在 AI 生成体验，而不是扩生态。

可能包含：

- CLI starter。
- Playground。
- 示例库。
- 错误诊断。
- cookbook 文档。
- 更适合 AI 生成的 API 约束和 lint 规则。

文档优先覆盖：

- counter
- form
- todo/list
- modal/portal
- async data view
- svg
- canvas

## v3: React to Himmel Codemod

React to Himmel codemod 放到 v3 或更晚。

它的目标不是运行 React，也不是兼容 React runtime，而是把 React/JSX 生态里可静态理解的 UI 代码迁移成 Himmel DSL。

原则：

- 转换结果是普通 Himmel 源码。
- 不依赖 React runtime。
- 转换过程透明，可调试、可修改、可验证。
- 只支持明确子集，复杂模式要给出诊断，不硬转。

第一版 codemod 只考虑 presentational component 子集：

- function component
- TypeScript props annotation
- 简单 JSX intrinsic elements
- className、style、id、data-*、href、src、alt、type、placeholder、value
- onClick、onInput 等直接事件
- string、number、props expression、简单 ternary children
- 能推导 key 的简单 `.map()` list

暂不支持：

- hooks
- context
- effect
- memo
- forwardRef
- render prop
- compound component
- React component wrapper
- Himmel to React adapter

## Non-goals

- 不做完整 React 替代品。
- 不嵌入 React runtime。
- 不优先建设大型 UI component library。
- 不在 v1 设计 animation adapter。
- 不在 core 里绑定某个第三方 animation library。
- 不追求 100% 转换 React 代码。
