import { type RouteConfig, route, index, layout } from '@react-router/dev/routes';

export default [
  // 登录页面（不需要布局）
  route('login', './routes/login/index.tsx'),
  route('article/save', './routes/article/saveArticlePage.tsx'),
  // 需要布局的路由
  layout('./components/layout.tsx', [
    index('./routes/home/index.tsx'),
    route('user', './routes/user/index.tsx'),
    route('article', './routes/article/index.tsx'),
    route('data', './routes/data/index.tsx'),
    route('comment', './routes/comment/index.tsx'),
    route('category', './routes/category/index.tsx'),
    route('tag', './routes/tag/index.tsx'),
    route('setting/baseSetting', './routes/setting/setting.tsx'),
    route('setting/userInfo', './routes/setting/userInfo.tsx'),
    route('setting/guestMessage', './routes/setting/guestMessage.tsx'),
    route('setting/updateLog', './routes/setting/updateLog.tsx'),
    route('setting/tools', './routes/setting/tools.tsx'),
  ]),
] satisfies RouteConfig;
