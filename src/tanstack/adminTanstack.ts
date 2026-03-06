import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../service/ApiAdmin";
import { useToast } from "@chakra-ui/react";

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (id: number | string) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userList"] });
            toast({
                title: "User deleted",
                status: "success",
                duration: null,
                isClosable: true,
                position: "top",
            });
        },
        onError: (error) => {
            toast({
                title: "Error deleting user",
                description: error.message,
                status: "error",
                duration: null,
                isClosable: true,
                position: "top",
            });
        },
    });
};