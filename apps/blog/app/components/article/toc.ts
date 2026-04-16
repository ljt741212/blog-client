/**
 * TOC（目录）相关工具方法：
 * - 从 Markdown 文本中提取标题（# ~ ######）
 * - 将标题列表构造成树（用于 antd Tree）
 * - 点击目录后，根据“标题级别 + 标题文本 + 重复序号”滚动到对应位置
 *
 * 说明：
 * - 这里不依赖任何 remark/rehype 插件，避免侵入 Viewer 渲染管线。
 * - 由于不注入稳定 id，本方案通过“文本匹配 + occurrence”定位标题。
 * - 若标题包含复杂内联（链接/加粗/代码）导致 textContent 不稳定，可改为“从 DOM 抓标题并缓存引用”或引入 slug/id 注入方案。
 */

export type TocHeading = {
  /** 标题级别：1~6（对应 h1~h6 / #~######） */
  level: number;
  /** 标题原始文本（去掉行尾 ### 的 closing hash） */
  title: string;
  /** 标题归一化文本（用于和 DOM textContent 对齐匹配） */
  normTitle: string;
  /** 同 level 同 normTitle 的第 N 次出现（从 0 开始），用于区分重复标题 */
  occurrence: number;
};

export type TocTreeNode = {
  /** 节点 key：用于 Tree 渲染与选中 */
  key: string;
  /** Tree 展示文本 */
  title: string;
  /** 标题级别：1~6 */
  level: number;
  /** 归一化标题文本 */
  normTitle: string;
  /** 重复序号 */
  occurrence: number;
  /** 子节点（更深级别的标题） */
  children?: TocTreeNode[];
};

/**
 * 将标题文本归一化，尽量与渲染后的 DOM textContent 对齐。
 * - 合并多余空白
 * - 去除常见 Markdown 装饰符
 * - 将 [text](url) 简化为 text
 */
export function normalizeHeadingText(s: string) {
  return s
    .replace(/\s+/g, ' ')
    .replace(/[`*_~]/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // [text](url) -> text
    .trim();
}

/**
 * 从 Markdown 源文本中提取标题行（# ~ ######）。
 * - 会跳过 fenced code block（``` 内）的内容，避免把代码里的 `##` 误识别为标题
 * - 对同级且同名标题统计 occurrence，用于后续精确滚动定位
 */
export function extractHeadingsFromMarkdown(markdown: string): TocHeading[] {
  const lines = markdown.split('\n');
  const flat: TocHeading[] = [];
  const seen = new Map<string, number>();
  let inFence = false;

  for (const line of lines) {
    // Skip fenced code blocks
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^(#{1,6})\s+(.*)$/.exec(line);
    if (!m) continue;

    const level = m[1].length;
    const rawTitle = m[2].replace(/\s+#+\s*$/, '').trim();
    const normTitle = normalizeHeadingText(rawTitle);
    if (!normTitle) continue;

    const k = `${level}|${normTitle}`;
    const n = seen.get(k) ?? 0;
    seen.set(k, n + 1);

    flat.push({ level, title: rawTitle, normTitle, occurrence: n });
  }

  return flat;
}

/**
 * 根据标题 level 构建树形结构（用于 antd Tree 展示）。
 * 规则：
 * - level 更大的标题会挂到最近的“更小 level 的标题”下面
 * - 相同或更小 level 会回退栈，成为新的兄弟节点/父节点
 */
export function buildTocTree(flat: TocHeading[]): TocTreeNode[] {
  const root: TocTreeNode[] = [];
  const stack: TocTreeNode[] = [];

  flat.forEach((h, idx) => {
    const node: TocTreeNode = {
      key: `${h.level}-${idx}`,
      title: h.title,
      level: h.level,
      normTitle: h.normTitle,
      occurrence: h.occurrence,
      children: [],
    };

    while (stack.length && stack[stack.length - 1].level >= node.level) stack.pop();

    if (!stack.length) {
      root.push(node);
    } else {
      stack[stack.length - 1].children!.push(node);
    }

    stack.push(node);
  });

  // Remove empty children to satisfy TreeDataNode expectations
  const prune = (nodes: TocTreeNode[]): TocTreeNode[] =>
    nodes.map(n => ({
      key: n.key,
      title: n.title,
      level: n.level,
      normTitle: n.normTitle,
      occurrence: n.occurrence,
      ...(n.children && n.children.length ? { children: prune(n.children) } : {}),
    }));

  return prune(root);
}

/**
 * 滚动整个页面到指定标题位置。
 *
 * @param rootId 仅在该 root 内查找 h1~h6（避免匹配到页面其它区域的标题）
 * @param target 通过 level + normTitle + occurrence 精确定位到某个标题 DOM
 * @param offset 距离视口顶部保留的偏移（例如 32px，用于顶部留白/固定栏）
 */
export function scrollPageToHeading(
  rootId: string,
  target: Pick<TocHeading, 'level' | 'normTitle' | 'occurrence'>,
  offset = 48
) {
  const root = document.getElementById(rootId) ?? document;

  const headings = Array.from(root.querySelectorAll('h1,h2,h3,h4,h5,h6'));
  const matches = headings.filter(h => {
    const level = Number(h.tagName.slice(1));
    if (level !== target.level) return false;
    return normalizeHeadingText(h.textContent ?? '') === target.normTitle;
  });

  const el = matches[target.occurrence];
  if (!el) return;

  const top = window.scrollY + el.getBoundingClientRect().top - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

/**
 * Backward-compatible export.
 * Some dev bundles may still import this name.
 */
/**
 * 滚动某个容器到指定标题位置（容器内部滚动）。
 *
 * 备注：
 * - 当前项目已经切到“整页滚动”，此方法主要用于兼容旧引用或将来再切回“左侧容器滚动”。
 */
export function scrollContainerToHeading(
  containerId: string,
  target: Pick<TocHeading, 'level' | 'normTitle' | 'occurrence'>,
  offset = 32
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const headings = Array.from(container.querySelectorAll('h1,h2,h3,h4,h5,h6'));
  const matches = headings.filter(h => {
    const level = Number(h.tagName.slice(1));
    if (level !== target.level) return false;
    return normalizeHeadingText(h.textContent ?? '') === target.normTitle;
  });

  const el = matches[target.occurrence];
  if (!el) return;

  const top =
    el.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop -
    offset;
  container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}
