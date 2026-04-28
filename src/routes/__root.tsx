import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Stock & Options Portfolio Manage" },
      { name: "description", content: "Azuki Trades is a full-stack stock and options portfolio manager with a minimalist, Azuki-inspired UI." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Stock & Options Portfolio Manage" },
      { property: "og:description", content: "Azuki Trades is a full-stack stock and options portfolio manager with a minimalist, Azuki-inspired UI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Stock & Options Portfolio Manage" },
      { name: "twitter:description", content: "Azuki Trades is a full-stack stock and options portfolio manager with a minimalist, Azuki-inspired UI." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bcc4e469-a106-4a15-9cae-8c876e0bd4f7/id-preview-bb97c519--a1fba506-5dd9-4c88-9025-d0e82dd1a11b.lovable.app-1777375747303.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bcc4e469-a106-4a15-9cae-8c876e0bd4f7/id-preview-bb97c519--a1fba506-5dd9-4c88-9025-d0e82dd1a11b.lovable.app-1777375747303.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
