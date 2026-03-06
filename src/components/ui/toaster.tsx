"use client"

import { Button, useToast } from "@chakra-ui/react"

export default function Example() {
  const toast = useToast()

  return (
    <Button
      onClick={() =>
        toast({
          title: "Upload complete",
          description: "Your file has been uploaded successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      }
    >
      Show Toast
    </Button>
  )
}