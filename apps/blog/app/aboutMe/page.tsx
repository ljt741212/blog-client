import Link from 'next/link';

import { getAuthor } from '@/lib/api';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '关于我',
};

export default async function AboutMe() {
  const author = await getAuthor();
  const { nickname, email, github, bio, wechat, phone, avatar } = author ?? {};

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex gap-12 p-32 pt-18 bg-[var(--page-bg)] max-w-full overflow-x-hidden">
        <div className="flex-1 flex flex-col gap-6">
          <header className="mb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">
              About Me
            </p>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">关于我</h1>
            <p className="text-base text-[var(--text-secondary)]">
              一个热爱技术与分享的 Web 开发者，记录代码、生活与思考。
            </p>
          </header>

          {bio && (
            <div
              className="rounded-2xl p-6 border"
              style={{
                background: 'var(--background-secondary)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <p className="leading-relaxed text-[var(--text-tertiary)] whitespace-pre-wrap">
                {bio}
              </p>
            </div>
          )}

          {!author && <p className="text-[var(--text-muted)]">暂无作者信息。</p>}
        </div>

        <div className="w-72 flex flex-col gap-6">
          <div
            className="rounded-2xl p-6 border flex flex-col items-center text-center"
            style={{
              background: 'var(--background-secondary)',
              borderColor: 'var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={nickname ?? ''}
                className="mb-4 h-24 w-24 rounded-full object-cover border-2"
                style={{ borderColor: 'var(--border-primary)' }}
              />
            ) : (
              <div
                className="mb-4 h-24 w-24 rounded-full border"
                style={{
                  background: 'var(--gradient-accent)',
                  borderColor: 'var(--border-primary)',
                }}
              />
            )}
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {nickname || '博主'}
            </h2>
          </div>

          <div
            className="rounded-2xl p-6 border"
            style={{
              background: 'var(--background-secondary)',
              borderColor: 'var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <h2 className="mb-4 text-base font-semibold text-[var(--text-primary)]">联系方式</h2>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Email', value: email },
                { label: 'GitHub', value: github },
                { label: 'WeChat', value: wechat },
                { label: 'Phone', value: phone },
              ]
                .filter(item => item.value)
                .map(item => (
                  <li key={item.label} className="flex justify-between gap-4">
                    <span className="text-[var(--text-muted)] shrink-0">{item.label}</span>
                    <span className="text-[var(--text-tertiary)] font-medium text-right break-all">
                      {item.value}
                    </span>
                  </li>
                ))}
              <li className="flex justify-between gap-4 pt-1">
                <span className="text-[var(--text-muted)] shrink-0">留言</span>
                <Link
                  href="/messageBoard"
                  className="text-[var(--primary)] font-medium text-right hover:underline"
                >
                  在留言板给我留言
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
