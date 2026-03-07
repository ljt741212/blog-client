import { getAuthor } from '@/lib/api';

export default async function AboutMe() {
  const user = await getAuthor();
  console.log(user);
  return (
    <div className="pt-20 pb-16 px-4 md:px-8 lg:px-0 max-h-screen">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10 border-b border-gray-200 pb-6 dark:border-gray-800">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-2">
            About Me
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-3">
            关于我
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            一个热爱技术与分享的 Web 开发者，记录代码、生活与思考。
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] items-start">
          <section className="space-y-8">
            <div className="rounded-2xl border border-gray-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-zinc-900/60">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-50">
                你好，我是
              </h2>
              <p className="mb-3 leading-relaxed text-gray-700 dark:text-gray-200">
                我是一名专注于前端 /
                全栈方向的开发者，喜欢折腾新的技术栈，也享受把想法通过代码变成现实的过程。
                平时会在这里记录一些技术笔记、项目实践以及对生活的感悟。
              </p>
              <p className="leading-relaxed text-gray-700 dark:text-gray-200">
                目前主要使用 <span className="font-medium">TypeScript、React、Next.js</span>{' '}
                等技术进行开发，对工程化、性能优化和产品体验都有持续的关注。
              </p>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white/70 p-6 text-center shadow-sm backdrop-blur dark:border-gray-800 dark:bg-zinc-900/70">
              <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border border-gray-200 bg-gradient-to-tr from-blue-500/70 via-emerald-400/70 to-cyan-500/70 dark:border-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                某某某
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                Web Developer / Blogger
              </p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                喜欢有温度、有细节的产品，也喜欢把复杂的问题拆分成清晰的方案。
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-zinc-900/70">
              <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-50">
                联系方式
              </h2>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <li className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Email</span>
                  <span className="font-medium">your.email@example.com</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">GitHub</span>
                  <span className="font-medium break-all">https://github.com/your-name</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">其他</span>
                  <span className="font-medium text-right">可以在本站留言板给我留言 👋</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
