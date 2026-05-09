import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { generateDetailedScienceNotes } from "../service/ApiDetailedNotes";


export const useInitiateDetailedNotesBatch = () => {
    const toast = useToast();

    return useMutation({
        mutationFn: generateDetailedScienceNotes, // API function to start the batch process
        onSuccess: () => {
            toast({
                title: "Fetch successful 🎉",
                description: "The batch details have been processed.",
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "top",
            });
        },
        onError: (error) => {
            toast({
                title: "Action failed ❌",
                description: error?.message || "Something went wrong.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right",
            });
        }
    });
};