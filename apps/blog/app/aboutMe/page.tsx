import { getAuthor } from '@/lib/api';

export default async function AboutMe() {
  const { nickname, email, github, bio, wechat, phone } = (await getAuthor()) ?? {};
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
              <p className="leading-relaxed text-gray-700 dark:text-gray-200">
                {bio}
              </p>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white/70 p-6 text-center shadow-sm backdrop-blur dark:border-gray-800 dark:bg-zinc-900/70">
              <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border border-gray-200 bg-gradient-to-tr from-blue-500/70 via-emerald-400/70 to-cyan-500/70 dark:border-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                {nickname}
              </h2>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-zinc-900/70">
              <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-50">
                联系方式
              </h2>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <li className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Email</span>
                  <span className="font-medium">{email}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">GitHub</span>
                  <span className="font-medium break-all">{github}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">WeChat</span>
                  <span className="font-medium break-all">{wechat}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Phone</span>
                  <span className="font-medium break-all">{phone}</span>
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
