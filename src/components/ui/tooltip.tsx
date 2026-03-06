"use client"

import { Tooltip, Button } from "@chakra-ui/react"

export const CustomTooltip = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return (
    <Tooltip label={label} hasArrow>
      {children}
    </Tooltip>
  )
}

// Example usage
export default function Example() {
  return (
    <CustomTooltip label="Click to save">
      <Button colorScheme="blue">Save</Button>
    </CustomTooltip>
  )
}