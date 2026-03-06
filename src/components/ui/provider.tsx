"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";

type ProviderProps = {
  children: React.ReactNode;
};

export function Provider({ children }: ProviderProps) {
  return (
    <ChakraProvider>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
