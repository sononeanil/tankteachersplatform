import { useQuery } from "@tanstack/react-query";
import { getChapterList, getChapterNotes } from "../service/ApiNotes";

export const useChapterNotes = (
    params: {
        key: string;
        chapter: string;
    },
    enabled: boolean
) => {
    return useQuery({
        queryKey: ["chapterNotes", params.key, params.chapter],
        queryFn: () => getChapterNotes(params),
        enabled, // only run when button clicked
    });
};

export const useChapterList = (
    params: {
        key: string;
    },
    enabled: boolean
) => {
    return useQuery({
        queryKey: ["getChapterList", params],
        queryFn: () => getChapterList(params),
        enabled, // only run when button clicked
    });
};