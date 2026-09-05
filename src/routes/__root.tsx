import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppProviders } from "@/components/providers";
import { Shell } from "@/components/shell";
import appCss from "../styles.css?url";

const APP_NAME = "ارزهاب";

const THEME_BOOT = `(function(){try{var t=localStorage.getItem("arzhub-theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${APP_NAME} | قیمت لحظه‌ای ارز به تومان` },
      {
        name: "description",
        content:
          "قیمت لحظه‌ای دلار، یورو، درهم و سایر ارزها در بازار آزاد تهران به تومان. نمودار، تبدیل ارز و فهرست پیگیری.",
      },
      { name: "theme-color", content: "#0b0c0e" },
      { name: "color-scheme", content: "light dark" },
      { name: "robots", content: "index,follow" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "application-name", content: APP_NAME },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className="antialiased">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <AppProviders>
            <Shell>
              <Outlet />
            </Shell>
          </AppProviders>
        </AuthProvider>
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="rounded-xl bg-card px-6 py-16 text-center shadow-card">
      <h1 className="text-lg font-semibold">صفحه پیدا نشد</h1>
      <p className="mt-2 text-sm text-muted">این مسیر در ارزهاب وجود ندارد.</p>
      <Link to="/" className="mt-4 inline-block text-sm text-accent hover:underline">
        بازگشت به خانه
      </Link>
    </div>
  );
}
