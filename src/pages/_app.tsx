import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps, type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ReactElement, ReactNode, useEffect, useLayoutEffect } from "react";
import { NextPage } from "next";
import ProgressBar from "@badrap/bar-of-progress";
import { useRouter } from "next/router";
import { Toaster } from "~/components/ui/toast/toaster";
import localFont from "next/font/local";
import { LanguageProvider } from "~/context/language.context";
import { LanguageSwitcher } from "~/components/main/language-switcher";
import { cn } from "~/lib/utils";
import ThemeBox from "~/features/theme-box";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  PageLayout?: (page: ReactElement) => ReactElement<any, any>;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const progress = new ProgressBar({
  size: 2,
  color: "#ffffff",
  className: "bar-of-progress",
  delay: 100,
});
function matchColorSchemeToTheme(theme) {
  if (theme.search("light"))
    document.querySelector("html").style.colorScheme = "light";
  if (theme.search("dark"))
    document.querySelector("html").style.colorScheme = "dark";
}

const iranSans = localFont({
  src: [
    {
      path: "../../public/fonts/IRANSansXFaNum-Thin.woff",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansXFaNum-UltraLight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansXFaNum-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansXFaNum-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansXFaNum-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansXFaNum-DemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansXFaNum-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansXFaNum-ExtraBold.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansXFaNum-Black.woff",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-iransans",
  display: "swap",
});
function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const router = useRouter();
  const canUseDOM = typeof window !== "undefined";
  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
  useIsomorphicLayoutEffect(() => {
    //top progress bar
    router.events.on("routeChangeStart", progress.start);
    router.events.on("routeChangeComplete", progress.finish);
    router.events.on("routeChangeError", progress.finish);

    // check for theme
    const theme = localStorage.getItem("theme");
    if (theme?.startsWith("theme")) {
      document.querySelector("body").className = theme;
      matchColorSchemeToTheme(theme);
      return;
    }

    const matchPrefersLight = window.matchMedia("(prefers-color-scheme:light)");
    if (matchPrefersLight.matches) {
      document.querySelector("body").className = "theme-light-2";
      localStorage.setItem("theme", "theme-light-2");
      matchColorSchemeToTheme("light");
    } else {
      document.querySelector("body").className = "theme-dark-1";
      localStorage.setItem("theme", "theme-dark-1");
      matchColorSchemeToTheme("dark");
    }
    matchPrefersLight.addEventListener("change", (event) => {
      const theme = event.matches ? "theme-light-2" : "theme-dark-3";

      document.querySelector("body").className = theme;
      localStorage.setItem("theme", theme);
      matchColorSchemeToTheme(theme);
    });

    return () => {
      router.events.off("routeChangeStart", progress.start);
      router.events.off("routeChangeComplete", progress.finish);
      router.events.off("routeChangeError", progress.finish);
    };
  }, []);

  // Use the layout defined at the page level, if available
  const getLayout = Component.PageLayout ?? ((page) => page);

  return Component.PageLayout ? (
    <main className={cn(iranSans.className)}>
      <SessionProvider session={session}>
        <LanguageProvider>
          <TopHeader />
          <Component.PageLayout {...pageProps} />
          <Toaster />
        </LanguageProvider>
      </SessionProvider>{" "}
    </main>
  ) : (
    <main className={cn(iranSans.className)}>
      <SessionProvider session={session}>
        <LanguageProvider>
          <TopHeader />
          <Component {...pageProps} />
          <Toaster />
        </LanguageProvider>
      </SessionProvider>
    </main>
  );
}

//@ts-ignore
export default api.withTRPC(MyApp);

function TopHeader() {
  return (
    <>
      <div className="flex items-center justify-between p-2 sm:px-20 sm:py-5">
        <LanguageSwitcher />
        <ThemeBox />
      </div>
    </>
  );
}
