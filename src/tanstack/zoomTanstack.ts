// hooks/useCreateZoom.ts
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { createZoomMeeting } from "../service/ApiZoom";
import type { CreateZoomMeetingType } from "../types/zoom";

export function useCreateZoom() {
    const toast = useToast();

    return useMutation({
        mutationFn: (newZoom: CreateZoomMeetingType) => createZoomMeeting(newZoom),

        onError: (err: any) => {
            toast({
                title: "CreateZoom failed",
                description: err.message,
                status: "error",
                duration: null,
                isClosable: true,
                position: "top",
            });
        },

        onSuccess: () => {
            toast({
                title: "CreateZoom successful!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        },
    });
}