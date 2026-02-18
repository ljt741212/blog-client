import { type RouteConfig, route, index, layout } from '@react-router/dev/routes';

export default [
  route('login', './routes/login/index.tsx'),
  route('article/save', './routes/article/saveArticlePage.tsx'),
  layout('./components/layout.tsx', [
    index('./routes/data/index.tsx'),
    route('user', './routes/user/index.tsx'),
    route('article', './routes/article/index.tsx'),
    // route('data', '.'),
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
