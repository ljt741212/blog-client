export default function ArticleLoading() {
  const shimmerBar = (w: string) => <div className={`${w} h-4 rounded shimmer`} />;

  return (
    <div className="w-full min-h-screen mt-12">
      <div className="mx-auto w-full px-32 py-2">
        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          {/* 左侧：文章内容骨架 */}
          <div className="flex-1 flex flex-col gap-4">
            <div
              className="rounded-2xl p-6 border flex flex-col gap-5"
              style={{
                background: 'var(--background-secondary)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {/* 标题 */}
              <div className="h-8 w-3/4 rounded-lg shimmer" />
              {/* 元信息行 */}
              <div className="flex gap-4">
                <div className="h-4 w-20 rounded shimmer" />
                <div className="h-4 w-16 rounded shimmer" />
                <div className="h-4 w-16 rounded shimmer" />
                <div className="h-4 w-16 rounded shimmer" />
              </div>
              <div className="h-px" style={{ background: 'var(--border-primary)' }} />
              {/* 正文段落骨架 */}
              <div className="flex flex-col gap-3">
                {shimmerBar('w-full')}
                {shimmerBar('w-11/12')}
                {shimmerBar('w-full')}
                {shimmerBar('w-5/6')}
                {shimmerBar('w-4/6')}
                <div className="h-8" />
                {shimmerBar('w-full')}
                {shimmerBar('w-full')}
                {shimmerBar('w-3/4')}
                {shimmerBar('w-full')}
                {shimmerBar('w-10/12')}
                {shimmerBar('w-5/6')}
              </div>
            </div>

            {/* 评论区骨架 */}
            <div
              className="rounded-2xl p-6 border"
              style={{
                background: 'var(--background-secondary)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div className="h-5 w-12 rounded shimmer mb-4" />
              <div className="h-24 w-full rounded-lg shimmer" />
            </div>
          </div>

          {/* 右侧：侧边栏骨架 */}
          <div className="w-72 flex flex-col gap-4 lg:sticky lg:top-6 self-start">
            {/* 目录 */}
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: 'var(--background-secondary)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div className="h-5 w-10 rounded shimmer mb-4" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-full rounded shimmer" />
                <div className="h-4 w-[90%] rounded shimmer ml-4" />
                <div className="h-4 w-[80%] rounded shimmer ml-4" />
                <div className="h-4 w-3/4 rounded shimmer" />
                <div className="h-4 w-[85%] rounded shimmer ml-4" />
              </div>
            </div>

            {/* 近期文章 */}
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: 'var(--background-secondary)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div className="h-5 w-16 rounded shimmer mb-4" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-full rounded shimmer" />
                <div className="h-4 w-5/6 rounded shimmer" />
                <div className="h-4 w-3/4 rounded shimmer" />
                <div className="h-4 w-4/5 rounded shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .shimmer {
          background: linear-gradient(
            90deg,
            var(--background-tertiary) 25%,
            var(--background-secondary) 50%,
            var(--background-tertiary) 75%
          ) !important;
          background-size: 200% 100% !important;
          animation: shimmer-slide 1.6s ease-in-out infinite;
        }
        @keyframes shimmer-slide {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-color-scheme: dark) {
          .shimmer {
            background: linear-gradient(
              90deg,
              var(--background-tertiary) 25%,
              var(--background-elevated) 50%,
              var(--background-tertiary) 75%
            ) !important;
            background-size: 200% 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
