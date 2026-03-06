import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllUploadedFilesList, getMetaDataRole, mutationPublishUpload } from "../Api";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import type { PublishUploadType } from "../types/userType";
import { getUserList } from "../service/ApiAdmin";

export const useGetAllUploadedFilesList = () => {
    const toast = useToast();

    const query = useQuery({
        queryKey: ["getAllUploadedFilesList"],
        queryFn: getAllUploadedFilesList,
    });

    // handle success/error via effects
    useEffect(() => {
        if (query.isError) {
            toast({
                title: "Unable to fetch uploaded files",
                description: (query.error as Error).message,
                status: "error",
                duration: null,
                isClosable: true,
                position: "top",
            });
        }

    }, [query.isError, query.isSuccess, toast, query.error]);

    return query;
};

export const useGetUserList = () => {
    const toast = useToast();

    const query = useQuery({
        queryKey: ["getUserList"],
        queryFn: getUserList,
    });

    // handle success/error via effects
    useEffect(() => {
        if (query.isError) {
            toast({
                title: "Unable to fetch UserList",
                description: (query.error as Error).message,
                status: "error",
                duration: null,
                isClosable: true,
                position: "top",
            });
        }

    }, [query.isError, query.isSuccess, toast, query.error]);

    return query;
};

export const useGetMetaDataRole = () => {
    const toast = useToast();

    const query = useQuery({
        queryKey: ["getMetaDataRole"],
        queryFn: () => getMetaDataRole("ROLE_LIST"),
    });

    // handle success/error via effects
    useEffect(() => {
        if (query.isError) {
            toast({
                title: "Unable to fetch Roles",
                description: (query.error as Error).message,
                status: "error",
                duration: null,
                isClosable: true,
                position: "top",
            });
        }

    }, [query.isError, query.isSuccess, toast, query.error]);

    return query;
};



export const usePublishUpload = () => {
    const toast = useToast()

    return useMutation({
        mutationFn: (newUpload: PublishUploadType) => mutationPublishUpload(newUpload),
        onSuccess: () => {
            toast({
                title: "Upload published successfully",
                status: "success",
                isClosable: true,
                position: "top",
            })
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : "Unknown error"
            toast({
                title: "Unable to publish upload",
                description: message,
                status: "error",
                isClosable: true,
                position: "top",
            })
        },
    })
}