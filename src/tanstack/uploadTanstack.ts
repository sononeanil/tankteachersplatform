import { useMutation } from "@tanstack/react-query";
import { getNotesApi, getNotesPDFApi } from "../service/ApiUpload";

export const useNotes = () => {

    const getNotesMutation = useMutation({
        mutationFn: getNotesApi,
    });

    const getNotesPDFMutation = useMutation({
        mutationFn: getNotesPDFApi,
    });

    const getNotes = (onSuccess?: Function, onError?: Function) => {
        getNotesMutation.mutate(undefined, {
            onSuccess: (data) => onSuccess?.(data),
            onError: (error) => onError?.(error),
        });
    };

    const getNotesPDF = (onSuccess?: Function, onError?: Function) => {
        getNotesPDFMutation.mutate(undefined, {
            onSuccess: (data) => onSuccess?.(data),
            onError: (error) => onError?.(error),
        });
    };

    return {
        getNotes,
        getNotesPDF,
        isLoadingNotes: getNotesMutation.isPending,
        isLoadingPDF: getNotesPDFMutation.isPending,
    };
};