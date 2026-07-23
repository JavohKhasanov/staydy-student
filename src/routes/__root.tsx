import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#171226" },
      { title: "Staydy — Talaba" },
      { name: "description", content: "Staydy Talaba — darslar, vazifalar, reyting va streak. Har kunlik o'quv sherigingiz." },
      { property: "og:title", content: "Staydy — Talaba" },
      { property: "og:description", content: "Bugungi darslar, vazifalar va momentum. Uzluksiz o'qish uchun mini app." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="font-display text-6xl font-bold text-primary">404</h1>
        <p className="mt-2 text-muted-foreground">Sahifa topilmadi</p>
        <a href="/" className="mt-6 inline-block rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground press">
          Bosh sahifa
        </a>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => {
    console.error(error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <h1 className="font-display text-2xl font-bold">Nimadir noto'g'ri ketdi</h1>
          <p className="mt-2 text-muted-foreground">Sahifani yangilab ko'ring.</p>
          <a href="/" className="mt-6 inline-block rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground press">
            Bosh sahifa
          </a>
        </div>
      </div>
    );
  },
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="uz">
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
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: "var(--elevated)",
            color: "var(--foreground)",
            border: "1px solid var(--hairline)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
