import { ConfigProvider, theme } from 'antd';
import { isRouteErrorResponse, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';
import './app.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const token = {
    colorBgBase: '#020617',
    colorBgContainer: '#111827',
    colorPrimary: '#6366f1',
    colorPrimaryHover: '#818cf8',
    colorPrimaryActive: '#4f46e5',
    colorLink: '#6366f1',
    colorLinkHover: '#818cf8',
    colorLinkActive: '#4f46e5',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#f97373',
    colorInfo: '#38bdf8',
    colorBorder: '#273549',
    colorBorderSecondary: '#1f2933',
    colorTextBase: '#e5e7eb',
  };

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
      </head>
      <body>
        <ConfigProvider
          theme={{
            token,
            algorithm: theme.darkAlgorithm,
            components: {
              Layout: {
                bodyBg: '#020617',
                headerBg: '#111827',
                siderBg: '#111827',
              },
              Menu: {
                darkItemBg: '#111827',
                darkItemSelectedBg: '#273549',
              },
            },
          }}
        >
          {children}
        </ConfigProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
