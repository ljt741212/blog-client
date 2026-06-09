import Image from 'next/image';

import { getFriendLinks } from '@/lib/api';

import ApplyForm from './ApplyForm';

import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '友情链接',
};

function AvatarOrIcon({ name, avatar }: { name: string; avatar?: string }) {
  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name}
        width={48}
        height={48}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-[var(--border-secondary)] group-hover:ring-[var(--primary)] transition-all duration-300"
      />
    );
  }
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold ring-2 ring-[var(--border-secondary)] group-hover:ring-[var(--primary)] transition-all duration-300 group-hover:scale-110"
      style={{
        background: 'var(--gradient-accent)',
        color: 'var(--primary)',
      }}
    >
      {name.charAt(0)}
    </div>
  );
}

export default async function FriendLinksPage() {
  const links = await getFriendLinks();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-32 pt-18 bg-[var(--page-bg)] max-w-full overflow-x-hidden">
        <header className="mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">
            Friends
          </p>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">友情链接</h1>
          <p className="text-base text-[var(--text-secondary)]">
            一些有趣、有价值的站点，欢迎交换友链～
          </p>
        </header>

        {links.length === 0 ? (
          <>
            <div
              className="rounded-3xl p-12 text-center border mb-8"
              style={{
                background: 'var(--gradient-card)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <p className="text-[var(--text-muted)] text-lg">暂无友情链接</p>
              <p className="text-[var(--text-tertiary)] text-sm mt-2">
                想成为第一个友链？填写下方表单申请～
              </p>
            </div>
            <div className="max-w-md">
              <div
                className="rounded-2xl p-6 border border-dashed"
                style={{
                  background: 'var(--gradient-card)',
                  borderColor: 'var(--border-secondary)',
                }}
              >
                <ApplyForm />
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            <div
              className="col-span-2 row-span-3 rounded-2xl p-6 border-2 border-dashed"
              style={{
                background: 'var(--gradient-card)',
                borderColor: 'var(--border-secondary)',
              }}
            >
              <ApplyForm />
            </div>

            {links.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square group flex flex-col items-center justify-center gap-3 rounded-2xl p-4 border text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--primary)]"
                style={{
                  background: 'var(--gradient-card)',
                  borderColor: 'var(--border-primary)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <AvatarOrIcon name={link.name} avatar={link.avatar} />
                <div className="flex-1 flex flex-col items-center justify-center min-w-0 w-full">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors duration-300 truncate w-full">
                    {link.name}
                  </h3>
                  <p className="text-[11px] text-[var(--text-disabled)] truncate w-full mt-1">
                    {link.url.replace(/^https?:\/\//, '')}
                  </p>
                  {link.description && (
                    <p className="text-xs text-[var(--text-tertiary)] leading-relaxed line-clamp-2 mt-1">
                      {link.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
