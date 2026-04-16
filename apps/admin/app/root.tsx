import { ConfigProvider, theme } from 'antd';
import { isRouteErrorResponse, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';
import './app.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const token = {
    colorBgBase: '#f3f6fb',
    colorBgContainer: '#ffffff',
    colorPrimary: '#2563eb',
    colorPrimaryHover: '#1d4ed8',
    colorPrimaryActive: '#1d4ed8',
    colorLink: '#2563eb',
    colorLinkHover: '#1d4ed8',
    colorLinkActive: '#1e3a8a',
    colorSuccess: '#16a34a',
    colorWarning: '#eab308',
    colorError: '#ef4444',
    colorInfo: '#0ea5e9',
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#cbd5f5',
    colorTextBase: '#0f172a',
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
      </head>
      <body>
        <ConfigProvider
          theme={{
            token,
            algorithm: theme.defaultAlgorithm,
            components: {
              Layout: {
                bodyBg: '#f3f6fb',
                headerBg: '#ffffff',
                siderBg: '#ffffff',
              },
              Menu: {
                itemBg: '#ffffff',
                itemSelectedBg: '#e5edff',
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
