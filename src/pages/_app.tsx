import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps, type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ReactElement, ReactNode, useEffect, useLayoutEffect } from "react";
import { NextPage } from "next";
import ProgressBar from "@badrap/bar-of-progress";
import { useRouter } from "next/router";

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
      return;
    }

    const matchPrefersLight = window.matchMedia("(prefers-color-scheme:light)");
    if (matchPrefersLight.matches) {
      document.querySelector("body").className = "theme-light-1";
    }
    matchPrefersLight.addEventListener("change", (event) => {
      alert("changed");
      const theme = event.matches ? "theme-light-2" : "theme-dark-3";
      document.querySelector("body").className = theme;
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
    <>
      <SessionProvider session={session}>
        //@ts-ignore
        <Component.PageLayout {...pageProps} />
      </SessionProvider>
    </>
  ) : (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

//@ts-ignore
export default api.withTRPC(MyApp);
