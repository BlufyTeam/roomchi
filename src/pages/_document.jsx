import Document, { Html, Head, Main, NextScript } from "next/document";
import { cn } from "~/lib/utils";
import { iranSans } from "~/pages/_app";

export default class MyDocument extends Document {
  render() {
    return (
      <Html dir="rtl" className={cn("h-full")}>
        <Head />
        <body
          className="theme-dark-3 scrollbar-track-[var(--accent)] h-full "
          style={{
            overflow: "overlay",
          }}
        >
          <Main />
          <div id="overlay"></div>
          <div
            id="portal"
            style={{
              overflow: "hidden",
            }}
          ></div>
          <div
            id="user-nav"
            style={{
              position: "sticky",
              bottom: "25px",
              marginTop: "25px",
              zIndex: "1000",
            }}
          ></div>
          <div id="toast"></div>

          <NextScript />
        </body>
      </Html>
    );
  }
}

/*

        <Scrollbar
          plugins={{
            overscroll: {
              effect: "glow",
            },
          }}
        >
        */
