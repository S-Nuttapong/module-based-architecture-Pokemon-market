import { ChakraProvider, Flex } from "@chakra-ui/react";
import type { AppProps } from "next/app";

// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
  background: {
    primary: "#252836",
    secondary: "#1F1D2B",
    overlay: "#000000B2",
    //disabled: "",
  },
  bg: {
    primary: "#252836",
    secondary: "#1F1D2B",
    overlay: "#000000B2",
    button: "#EA7C69",
  },
  border: {
    divider: "#FFFFFF14",
    primary: "#393C49",
  },
  content: {
    primary: "#FFFFFF",
    secondary: "#ABBBC2",
    disabled: "#FFFFFF66",
  },
};

const theme = extendTheme({ colors });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
