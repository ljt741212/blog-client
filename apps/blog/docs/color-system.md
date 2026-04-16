# 博客前端色系设计文档

## 概述

本色系方案基于 Card 组件的设计，采用深色主题，以蓝色为主色调，辅以紫色和粉色的渐变效果，营造现代、优雅的视觉体验。

## 色系架构

### 1. 基础背景色

- **主背景** (`--background`): `#0f172a` (slate-900)
  - 用于页面主体背景
- **次要背景** (`--background-secondary`): `#1e293b` (slate-800)
  - 用于导航栏、卡片容器等
- **第三背景** (`--background-tertiary`): `#334155` (slate-700)
  - 用于嵌套容器、输入框等

### 2. 主色调 - 蓝色系

- **主色** (`--primary`): `#60a5fa` (blue-400)
  - 主要强调色，用于链接、按钮、图标等
- **浅蓝色** (`--primary-light`): `#93c5fd` (blue-300)
  - 用于文字强调、作者信息等
- **深蓝色** (`--primary-dark`): `#3b82f6` (blue-500)
  - 用于按钮悬停状态等

- **半透明蓝色**:
  - `--primary-alpha-10`: `rgba(96, 165, 250, 0.1)` - 用于边框、背景
  - `--primary-alpha-20`: `rgba(96, 165, 250, 0.2)` - 用于强调背景

### 3. 辅助色

#### 紫色系

- **紫色** (`--accent-purple`): `#a78bfa` (purple-400)
  - 用于渐变效果、装饰元素
- **半透明紫色** (`--accent-purple-alpha-10`): `rgba(167, 139, 250, 0.1)`

#### 粉色系

- **粉色** (`--accent-pink`): `#f472b6` (pink-400)
  - 用于渐变效果、装饰元素
- **半透明粉色** (`--accent-pink-alpha-10`): `rgba(244, 114, 182, 0.1)`

### 4. 文字颜色

- **主文字** (`--text-primary`): `#ffffff`
  - 用于标题、重要文字
- **次要文字** (`--text-secondary`): `#93c5fd` (blue-300)
  - 用于作者、链接文字
- **第三文字** (`--text-tertiary`): `#cbd5e1` (gray-300)
  - 用于正文内容、导航链接
- **弱化文字** (`--text-muted`): `#94a3b8` (gray-400)
  - 用于日期、辅助信息
- **禁用文字** (`--text-disabled`): `#64748b` (gray-500)
  - 用于禁用状态、次要数据

### 5. 边框颜色

- **主边框** (`--border-primary`): `rgba(96, 165, 250, 0.1)`
  - 用于卡片、容器边框
- **次要边框** (`--border-secondary`): `rgba(96, 165, 250, 0.2)`
  - 用于强调边框
- **强调边框** (`--border-accent`): `rgba(96, 165, 250, 0.3)`
  - 用于悬停状态、焦点状态

### 6. 阴影系统

- `--shadow-sm`: 小阴影，用于轻微提升
- `--shadow-md`: 中等阴影，用于卡片
- `--shadow-lg`: 大阴影，用于重要卡片
- `--shadow-xl`: 超大阴影，用于主要卡片（Card组件）
- `--shadow-2xl`: 最大阴影，用于悬停状态

### 7. 渐变效果

#### 卡片渐变 (`--gradient-card`)

```css
linear-gradient(to bottom right,
  rgba(31, 41, 55, 0.8),   /* gray-800/80 */
  rgba(55, 65, 81, 0.7),   /* gray-700/70 */
  rgba(17, 24, 39, 0.8))   /* gray-900/80 */
```

#### 强调渐变 (`--gradient-accent`)

```css
linear-gradient(to bottom right,
  rgba(96, 165, 250, 0.2),   /* blue-400/20 */
  rgba(167, 139, 250, 0.1),   /* purple-400/10 */
  rgba(244, 114, 182, 0.1))  /* pink-400/10 */
```

## 使用示例

### 在 Tailwind CSS 中使用

```tsx
// 使用 CSS 变量
<div className="bg-[var(--background)] text-[var(--text-primary)]">
  <h1 className="text-[var(--text-secondary)]">标题</h1>
  <p className="text-[var(--text-tertiary)]">内容</p>
</div>

// 卡片样式
<div className="bg-gradient-to-br from-gray-800/80 via-gray-700/70 to-gray-900/80
  border border-[var(--border-primary)] shadow-xl">
  卡片内容
</div>
```

### 在 CSS 中使用

```css
.my-card {
  background: var(--gradient-card);
  border: 1px solid var(--border-primary);
  box-shadow: var(--shadow-xl);
  color: var(--text-primary);
}

.my-button {
  background: var(--primary);
  color: var(--text-primary);
  border: 1px solid var(--border-secondary);
}

.my-button:hover {
  background: var(--primary-dark);
  box-shadow: var(--shadow-lg);
}
```

## 组件色系应用

### Card 组件

- 背景：深灰色渐变 (`from-gray-800/80 via-gray-700/70 to-gray-900/80`)
- 边框：蓝色半透明 (`border-blue-400/10`)
- 阴影：`shadow-xl`，悬停时 `shadow-2xl`
- 头像区域：蓝紫粉渐变 (`from-blue-400/20 via-purple-400/10 to-pink-400/10`)

### NavBar 组件

- 背景：次要背景色 + 半透明 (`bg-[var(--background-secondary)]/80`)
- 边框：主边框色 (`border-[var(--border-primary)]`)
- 文字：第三文字色，悬停时主文字色

### 文字层级

- 标题：`text-white`
- 作者/链接：`text-blue-300`
- 正文：`text-gray-300`
- 辅助信息：`text-gray-400` / `text-gray-500`

## 设计原则

1. **一致性**：所有组件使用统一的色系变量
2. **层次感**：通过颜色深浅和透明度建立视觉层次
3. **可读性**：确保文字与背景有足够的对比度
4. **现代感**：使用渐变和毛玻璃效果增强视觉体验
5. **交互性**：通过颜色变化和阴影提升反馈感

## 扩展建议

未来可以添加：

- 亮色主题模式
- 更多语义化颜色（成功、警告、错误等）
- 动画过渡效果的颜色变量
- 响应式颜色调整
