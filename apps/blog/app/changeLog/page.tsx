import { getChangelogs } from '@/lib/api';
import type { Changelog, ChangelogType } from '@/types';

export const metadata = {
  title: '更新日志',
  description: '博客与系统的版本更新记录',
};

type GroupedEntry = {
  version: string;
  date: string;
  items: { type: ChangelogType; text: string }[];
};

function groupChangelogs(list: Changelog[]): GroupedEntry[] {
  const map = new Map<string, GroupedEntry>();
  for (const item of list) {
    const dateStr =
      typeof item.releaseDate === 'string'
        ? item.releaseDate.slice(0, 10)
        : new Date(item.releaseDate).toISOString().slice(0, 10);
    const key = `${item.version}\t${dateStr}`;
    let entry = map.get(key);
    if (!entry) {
      entry = { version: item.version, date: dateStr, items: [] };
      map.set(key, entry);
    }
    entry.items.push({
      type: item.type,
      text: item.title || item.content || '',
    });
  }
  return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date, 'sv'));
}

const typeLabels: Record<ChangelogType, { label: string; className: string }> = {
  feature: {
    label: '新功能',
    className: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  bugfix: {
    label: '修复',
    className: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  improvement: {
    label: '优化',
    className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  security: {
    label: '安全',
    className: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
};

function TypeBadge({ type }: { type: ChangelogType }) {
  const config = typeLabels[type] ?? {
    label: type,
    className: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default async function ChangeLogPage() {
  let entries: GroupedEntry[] = [];
  let error: string | null = null;

  try {
    const list = await getChangelogs();
    entries = groupChangelogs(list);
  } catch (e) {
    error =
      e && typeof e === 'object' && 'message' in e
        ? String((e as { message: string }).message)
        : '加载更新日志失败';
  }

  return (
    <div className="pt-20 pb-16 px-32 max-w-3xl">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">更新日志</h1>
        <p className="mt-2 text-[var(--text-muted)]">记录博客与系统的版本更新，按时间倒序排列。</p>
      </header>

      {error ? (
        <div
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-200"
          role="alert"
        >
          {error}
        </div>
      ) : entries.length === 0 ? (
        <p className="text-[var(--text-muted)]">暂无更新日志。</p>
      ) : (
        <div className="relative">
          <div
            className="absolute left-[11px] top-2 bottom-2 w-px bg-[var(--border-primary)]"
            aria-hidden
          />
          <ul className="space-y-10">
            {entries.map(entry => (
              <li key={`${entry.version}-${entry.date}`} className="relative flex gap-6">
                <div
                  className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-[var(--background)]"
                  aria-hidden
                >
                  <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex flex-wrap items-baseline gap-2 mb-3">
                    <span className="text-lg font-semibold text-[var(--text-primary)]">
                      v{entry.version}
                    </span>
                    <time dateTime={entry.date} className="text-sm text-[var(--text-muted)]">
                      {entry.date}
                    </time>
                  </div>
                  <ul className="space-y-2">
                    {entry.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex flex-wrap items-center gap-2 text-[var(--text-tertiary)]"
                      >
                        <TypeBadge type={item.type} />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
