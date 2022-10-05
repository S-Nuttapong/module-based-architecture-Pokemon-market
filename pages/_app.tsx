import type { AppProps } from "next/app";
import { SEOMeta } from "../components/SEOMeta";
import { ThemeProvider } from "../context/ThemeProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
