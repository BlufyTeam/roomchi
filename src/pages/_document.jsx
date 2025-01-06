import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html className=" h-full" dir="rtl">
        <Head>
          {/* <link rel="shortcut icon" href={favicon} /> */}
          {/* <link rel="shortcut icon" href="/icons/main/roomchi.svg" /> */}
          <title>Meet App</title>
        </Head>

        <body
          className="theme-dark-3 scrollbar-track-[var(--accent)] h-full"
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
