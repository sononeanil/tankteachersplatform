
import axios from "axios";
import aiClient from "./AiClient";

export const getChapterNotes = async (params: {
    key: string;
    chapter: string;
}) => {
    try {
        const response = await aiClient.get("/genai/notes/chapterNotes", {
            params, // query params
        });

        console.log("Chapter Notes: 11111", response.data);
        return response.data.notes;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(
                    error.response.data?.message || error.response.data
                );
            }
        }
        throw new Error("Network error " + error);
    }
};

export const getChapterList = async (params: {
    key: string;
}) => {
    try {
        const response = await aiClient.get("/genai/notes/chapterList", {
            params, // query params
        });

        console.log("Chapter List: 111111", response.data.lstChapters);
        return response.data.lstChapters;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(
                    error.response.data?.message || error.response.data
                );
            }
        }
        throw new Error("Network error " + error);
    }
};

export const getChapterListFilter = async (params: {
    key: string;
}) => {
    try {
        const response = await aiClient.get("/genai/notes/chapterListFilter", {
            params, // query params
        });

        console.log("Chapter List:", response.data.lstChapters);
        return response.data.lstChapters;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(
                    error.response.data?.message || error.response.data
                );
            }
        }
        throw new Error("Network error " + error);
    }
};