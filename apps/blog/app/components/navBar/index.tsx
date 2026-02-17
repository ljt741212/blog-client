import NavLink from './navLink';

const menuItems = [
  [
    {
      label: '首页',
      href: '/',
    },
    {
      label: '更新日志',
      href: '/changeLog',
    },
    {
      label: '留言板',
      href: '/messageBoard',
    },
    {
      label: '关于博客',
      href: '/aboutBlog',
    },
  ],
  [
    {
      label: '关于我',
      href: '/aboutMe',
    },
  ],
];

export default function NavBar() {
  const [homeMenu, aboutMeMenu] = menuItems;
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full h-12
     backdrop-blur-xl backdrop-saturate-150 border-b border-[var(--border-primary)] 
     bg-[var(--background-secondary)]/60 px-32"
    >
      <div className="flex items-center space-x-6">
        {homeMenu.map(item => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
      </div>
      <div className="flex items-center space-x-6">
        {aboutMeMenu.map(item => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
      </div>
    </nav>
  );
}
