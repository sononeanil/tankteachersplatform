"use client"

import type { IconButtonProps } from "@chakra-ui/react"
import { IconButton, Skeleton, chakra } from "@chakra-ui/react"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"

// Chakra already has its own ColorModeProvider and hooks.
// You don’t need next-themes if you’re not in Next.js.
import {
  ChakraProvider,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"

// Provider
export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>
}

// Icon that switches based on mode
export function ColorModeIcon() {
  const icon = useColorModeValue(<LuSun />, <LuMoon />)
  return icon
}

// Button to toggle color mode
export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  Omit<IconButtonProps, "aria-label">
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode()

  // Simple fallback skeleton until mounted
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <Skeleton boxSize="9" />
  }

  return (
    <IconButton
      onClick={toggleColorMode}
      variant="ghost"
      aria-label="Toggle color mode"
      size="sm"
      ref={ref}
      {...props}
      icon={<ColorModeIcon />}
    />
  )
})

// Chakra doesn’t export Span, so use chakra.span
const Span = chakra.span

export const LightMode = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof Span>>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        ref={ref}
        {...props}
      />
    )
  },
)

export const DarkMode = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof Span>>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        ref={ref}
        {...props}
      />
    )
  },
)