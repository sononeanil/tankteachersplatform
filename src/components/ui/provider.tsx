"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "../../theme/index";

type ProviderProps = {
  children: React.ReactNode;
};

export function Provider({ children }: ProviderProps) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
}