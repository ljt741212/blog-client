# AI 助理面板 UI 设计文档

## 1. 触发器

位置：顶部 Header 栏，Logo 右侧、设置按钮左侧。

```
┌──────────────────────────────────────────────────────────┐
│  Logo  Admin          AI 助理              [⚙ 设置]      │
│                             ^^^^                         │
│                        渐变文字按钮                       │
└──────────────────────────────────────────────────────────┘
```

- 文字：`AI 助理`
- 样式：渐变文字 `bg-gradient-to-r from-[#7c5cfc] to-[#e056a0] bg-clip-text text-transparent`，`font-medium`
- Hover：增加文字光晕 `text-shadow: 0 0 12px rgba(124,92,252,0.5)`
- 点击：打开 AI 助理面板

---

## 2. 面板整体布局

面板从右侧滑入，默认宽度 `640px`，带 backdrop。

```
══════════════════════════════════════════════════════════╗  ← 流光边框
║  CX330 AI 助理   [+][][⊞][][⚙][×]                    ║  ← Toolbar
║ ──────────────────────────────────────────────────────  ║  ← 分隔线
║                                                          ║
║                                                          ║
║            你好，我是                                     ║
║            CX330 AI 助理       ← 渐变大字                 ║
║                                                          ║
║   ┌────────────────┐   ┌────────────────┐               ║
║   │  近期热点     │   │  推荐解决方案   │               ║  ← 欢迎屏卡片
║   │  • 3条待审核…   │   │  • 帮我总结…    │               ║
║   │  • 2个新友链…   │   │  • 审核评论…    │               ║
║   │  • 上周PV+12%  │   │  • 查看流量数据  │               ║
║   ────────────────┘   └────────────────┘               ║
║                                                          ║
║   ┌──────────────────────────────────────────────────┐  ║
║   │  帮我看看最近的流量数据怎么样                      │    ← 用户消息
║   └──────────────────────────────────────────────────┘  ║
║                                                          ║
║   ┌──────────────────────────────────────────────────┐  ║
║   │  AI  最近7天 PV 趋势上升了 12%，其中技术类文章     │  ║  ← AI 消息
║   │       贡献最大。以下是详细数据：                    │  ║
║   │       ┌─  get_visitor_dashboard ──────────┐   ║  ← 工具调用
║   │       │  ✅ 已完成                           │   ║
║   │       ──────────────────────────────────────┘
║   └──────────────────────────────────────────────────┘  ║
║                                                          ║
║ ──────────────────────────────────────────────────────  ║  ← 分隔线
║  ┌──────────────────────────────────────────────────┐   ║
║  │  请输入您遇到的问题...              [🧠 深度思考]  │   ║  ← 输入框
║  │                                      [  ↑ 发送 ]  │   ║
║  └──────────────────────────────────────────────────┘   ║
║     内容由 AI 生成，仅供参考，您据此所作判断及操作       ║
║     均由您自行承担责任。                                  ║
══════════════════════════════════════════════════════════╝
```

---

## 3. 视觉系统

### 色彩

| Token            | 色值              | 用途                  |
| ---------------- | ----------------- | --------------------- |
| `--panel-bg`     | `#0f0a1a`         | 面板深紫底色          |
| `--surface`      | `#1a1333`         | 浮层/卡片/输入框背景  |
| `--border`       | `#2d2050`         | 细分隔线、默认边框    |
| `--text-primary` | `#e8e0f0`         | 主文字                |
| `--text-muted`   | `#8a7ca0`         | 次要文字、placeholder |
| `--accent-start` | `#7c5cfc`         | 渐变起始（紫）        |
| `--accent-end`   | `#e056a0`         | 渐变终止（粉）        |
| `--user-bubble`  | `#7c5cfc`         | 用户消息气泡背景      |
| `--tool-bg`      | `#1f1840`         | 工具调用指示器背景    |
| `--success`      | `#56d364`         | 工具完成 / 确认通过   |
| `--danger`       | `#f85149`         | 危险操作确认          |
| `--backdrop`     | `rgba(0,0,0,0.4)` | 面板 backdrop         |

### 字体

| 角色            | 字体                   | 用途             |
| --------------- | ---------------------- | ---------------- |
| 正文 / 消息     | Inter（系统字体栈）    | 所有 UI 文字     |
| 工具参数 / 代码 | JetBrains Mono（等宽） | 工具名、代码片段 |

### 圆角

- 面板：`rounded-xl` (12px)
- 卡片：`rounded-xl` (12px)
- 消息气泡：`rounded-2xl` (16px)，用户气泡右下角 `rounded-br-sm` (4px)
- 输入框：`rounded-xl` (12px)
- 工具指示器：`rounded-lg` (8px)
- 按钮：`rounded-lg` (8px)

---

## 4. Toolbar（6 个按钮）

面板顶部，从左到右排列：

| #   | 图标                                            | 功能     | 行为                                                |
| --- | ----------------------------------------------- | -------- | --------------------------------------------------- |
| 1   | `PlusOutlined` `+`                              | 新建会话 | 清空当前消息，开始新对话                            |
| 2   | `ClockCircleOutlined` `🕘`                      | 会话记录 | 弹出左侧抽屉，显示历史会话列表                      |
| 3   | `ColumnWidthOutlined` `⊞`                       | 浮动模式 | Toggle：面板变为可拖拽小窗口 (420×600)，无 backdrop |
| 4   | `FullscreenOutlined` / `FullscreenExitOutlined` | 全屏模式 | Toggle：面板扩展到 `100vw × 100vh`，无 backdrop     |
| 5   | `SettingOutlined` `⚙`                           | 设置     | 占位，暂不实现                                      |
| 6   | `CloseOutlined` `×`                             | 关闭面板 | 关闭面板，回到页面                                  |

### 面板模式

| 模式     | 尺寸               | Backdrop             | 位置                   |
| -------- | ------------------ | -------------------- | ---------------------- |
| **默认** | 640px 宽, 100vh 高 | 有 `rgba(0,0,0,0.4)` | 右侧固定               |
| **全屏** | 100vw × 100vh      | 无                   | 覆盖整个视口           |
| **浮动** | 420px × 600px      | 无                   | 可自由拖拽，默认右下角 |

---

## 5. 欢迎屏（无消息时显示）

### 渐变大字问候

```
你好，我是
CX330 AI 助理
```

- `font-size: 2rem`，`font-weight: 700`
- "CX330 AI 助理" 使用渐变文字：`bg-gradient-to-r from-[#7c5cfc] to-[#e056a0] bg-clip-text text-transparent`

### 两张卡片（并排）

```
┌──────────────────┐  ┌──────────────────┐
│  近期热点      ☁ │  │  推荐解决方案      │
│  (渐变标题)       │  │  (渐变标题)        │
──────────────────┤  ├──────────────────┤
│  • 3条待审核评论  │  │  • 帮我总结最近的  │
│  • 2个新友链申请  │  │    文章            │
│  • 上周 PV +12%  │  │  • 审核所有待处理   │
│                  │  │    的评论          │
│                  │  │  • 查看流量数据    │
│  [<  >]  ← 翻页  │  │  • 写一篇关于      │
└──────────────────┘  │    React 19 的文章  │
                      └──────────────────┘
```

**左卡片「近期热点」**：

- 从后端拉取动态数据（待审核评论数、新友链数、PV 变化）
- 底部有左右翻页箭头（如果条目多）
- 每条可点击 → 自动作为消息发送

**右卡片「推荐解决方案」**：

- 预置快捷指令（前端静态数据）
- 每条可点击 → 自动填入输入框并发送

**卡片样式**：

- `bg-[#1a1333] border border-[#2d2050] rounded-xl p-4`
- 标题渐变文字：`bg-gradient-to-r from-[#7c5cfc] to-[#e056a0] bg-clip-text text-transparent`，`font-semibold`
- Hover：`border-color → #7c5cfc`（渐变过渡 200ms）
- 列表项：`text-sm text-[#e8e0f0] cursor-pointer hover:text-[#7c5cfc] transition-colors`，每条之间 `border-b border-[#2d2050]`

---

## 6. 消息区

### 用户消息

```
                                    ┌──────────────────────────┐
                                    │ 帮我看看最近的流量数据    │
                                    │ 怎么样                    │
                                    └──────────────────────────┘
```

- 右对齐
- `max-width: 80%`
- `bg-[#7c5cfc] text-white rounded-2xl rounded-br-sm px-4 py-3`
- `text-sm`
- 动画：`animate-in slide-in-from-right fade-in duration-200`

### AI 消息

```
  ┌──┐  ┌──────────────────────────────────────────┐
  │AI│  │ 最近7天 PV 趋势上升了 12%，其中技术类     │
  │  │  │ 文章贡献最大。以下是详细数据：              │
  └──┘  │                                            │
        │  ─ 📊 get_visitor_dashboard ────────┐  │
        │  │  ✅ 已完成                         │  │
        │  └─────────────────────────────────────┘  │
        └──────────────────────────────────────────┘
```

- AI 头像：`w-8 h-8 rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#e056a0]`，居中显示 `AI`，`text-white text-xs font-bold`
- 文字：`text-sm text-[#e8e0f0] whitespace-pre-wrap leading-relaxed`
- 流式输出时末尾显示光标：`<span className="animate-pulse">▌</span>`
- 动画：`animate-in slide-in-from-left fade-in duration-200`

### 工具调用指示器

```
  ┌─ 📊 get_visitor_dashboard ─────────────────┐
  │  ✅ 已完成                                  │
  └─────────────────────────────────────────────┘
```

- 在 AI 消息下方缩进显示
- `bg-[#1f1840] rounded-lg px-3 py-2 mt-2`
- 图标：工具类型 emoji 或图标
- 工具名：`font-mono text-xs text-[#7c5cfc]`
- 状态：`text-xs text-[#8a7ca0]`
  - 运行中：`<LoadingOutlined spin /> 运行中...`
  - 完成：`✅ 已完成`
  - 失败：`❌ 失败`

### 危险操作确认对话框

```
  ┌──────────────────────────────────────────────────┐
  │  ⚠️ 需要确认                                      │
  │                                                   │
  │  即将删除文章「React 19 新特性详解」，此操作      │
  │  不可恢复。确认继续吗？                             │
  │                                                   │
  │                          [取消]  [确认执行]        │
  ──────────────────────────────────────────────────┘
```

- `bg-[#1f1840] border border-[#f85149]/30 rounded-xl p-4 mt-3 ml-11`
- 标题行：`<span className="text-[#f85149]">⚠️</span> 需要确认`，`text-sm font-medium text-[#e8e0f0]`
- 描述：`text-sm text-[#8a7ca0] mb-4`
- 按钮：`取消`（文字按钮，`text-[#8a7ca0]`）+ `确认执行`（danger 按钮，红色）
- **确认期间输入框禁用**

---

## 7. 输入框

```
  ┌──────────────────────────────────────────────────┐
  │  请输入您遇到的问题，使用 Shift + Enter 换行      │
  │                                                   │
  │                  [🧠 深度思考]          [  ↑  ]   │
  ──────────────────────────────────────────────────┘
     内容由 AI 生成，仅供参考，您据此所作判断及操作
     均由您自行承担责任。
```

- 外层容器：`bg-[#1a1333] rounded-xl border border-[#2d2050] focus-within:border-[#7c5cfc] transition-colors px-3 py-2`
- Textarea：
  - `flex-1 bg-transparent text-sm text-[#e8e0f0] resize-none outline-none`
  - `placeholder:text-[#8a7ca0]`
  - 自适应高度，最小 1 行，最大 5 行（约 120px）
  - `Enter` 发送，`Shift+Enter` 换行
- 深度思考 Toggle：
  - 左下角，antd `Switch` 组件，`size="small"`
  - 标签：`🧠 深度思考`，`text-xs text-[#8a7ca0]`
  - 选中色：`#7c5cfc`
- 发送按钮：
  - 右下角，`w-8 h-8 rounded-lg`
  - 背景：`bg-gradient-to-r from-[#7c5cfc] to-[#e056a0]`
  - 图标：`↑`（箭头），`text-white`
  - 无内容或正在流式输出时：`opacity-30 cursor-not-allowed`
- 底部提示：`text-[11px] text-[#8a7ca0] mt-2 text-center`

---

## 8. 流光边框

使用 CSS 伪元素实现渐变流光动画，沿面板四边循环流动。

```css
.ai-chat-panel {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.ai-chat-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 2px; /* 边框宽度 */
  background: linear-gradient(90deg, #7c5cfc, #e056a0, #7c5cfc, #e056a0);
  background-size: 300% 100%;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: borderFlow 3s linear infinite;
  pointer-events: none;
  z-index: 10;
}

@keyframes borderFlow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 300% 50%;
  }
}
```

- 渐变色：紫 `#7c5cfc` → 粉 `#e056a0` → 紫 `#7c5cfc` → 粉 `#e056a0`（循环）
- 动画周期：`3s`，`linear`，无限循环
- 边框宽度：`2px`
- `pointer-events: none` 确保不拦截面板内交互

---

## 9. 动画规范

| 动画       | 触发         | 效果                                      | 时长      | Easing                           |
| ---------- | ------------ | ----------------------------------------- | --------- | -------------------------------- |
| 面板入场   | 点击触发器   | `translateX(100%) → 0` + `opacity: 0 → 1` | 300ms     | `cubic-bezier(0.32, 0.72, 0, 1)` |
| 面板退场   | 点击关闭/ESC | `translateX(0 → 100%)` + `opacity: 1 → 0` | 200ms     | `ease-out`                       |
| 消息出现   | 新消息       | `slide-in + fade-in`                      | 200ms     | `ease-out`                       |
| 流光边框   | 持续         | `background-position` 位移                | 3s/loop   | `linear`                         |
| 光标闪烁   | 流式输出中   | `opacity: 1 → 0`                          | 0.8s/loop | `step-end`                       |
| 卡片 Hover | 鼠标悬停     | `border-color` 渐变过渡                   | 200ms     | `ease`                           |
| 全屏切换   | 点击全屏按钮 | `width/height` 过渡                       | 300ms     | `cubic-bezier(0.32, 0.72, 0, 1)` |

---

## 10. 响应式

| 断点             | 面板宽度        | 卡片布局 |
| ---------------- | --------------- | -------- |
| `≥ 1024px`       | 640px           | 两列并排 |
| `768px ~ 1023px` | 480px           | 两列并排 |
| `< 768px`        | `100vw`（全屏） | 单列堆叠 |

---

## 11. 文件结构

```
apps/admin/app/
├── components/
│   ├── AiChatPanel.tsx          # 面板主组件（含欢迎屏、消息区、输入框、流光边框）
│   ├── AiChatToolbar.tsx        # Toolbar 6 按钮子组件
│   ├── AiChatWelcome.tsx        # 欢迎屏子组件（渐变大字 + 两张卡片）
│   ├── AiChatMessage.tsx        # 消息气泡子组件（用户/AI/工具调用/确认）
│   ├── AiChatComposer.tsx       # 输入框子组件
│   ├── AiChatConversationList.tsx # 会话记录抽屉子组件
│   └── BorderBeam.tsx           # 流光边框组件
├── services/
│   └── ai.ts                    # [修改] 新增 SSE 方法 + 会话管理方法
└── types/
    └── ai.ts                    # [修改] 新增 SSE 相关类型
```
