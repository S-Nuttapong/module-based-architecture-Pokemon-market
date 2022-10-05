import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

//Extend the theme to include custom colors, fonts, etc
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
  },
  button: {
    primary: "#363946",
    secondary: "#EA7C69",
    disabled: "#312f3c",
    hover: "#4d4f5a",
    focus: "#4d4f5a",
  },
  bg: {
    primary: "#252836",
    secondary: "#1F1D2B",
    overlay: "#000000B2",
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

type Props = {
  children?: React.ReactNode;
};

export const ThemeProvider = ({ children }: Props) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);
