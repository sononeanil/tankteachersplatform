
import axios from "axios";
import aiClient from "./AiClient";
import type { StudentQuestionType } from "../types/notesType";
import apiClient from "./ApiClient";

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

export const getNotesBatchChapterList = async (standard: string, subject: string) => {

    try {
        const { data } = await aiClient.get(`/learningplatform/notesbatch/getNotesBatchChapterList`, { params: { standard, subject } })
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(
                    error.response.data?.message || error.response.data
                );
            }
        }
        throw new Error("Network error " + error);
    }
}

export const getDetailedNotes = async (params: { classNumber: string; subject: string; chapterNumber: string }) => {
    // Axios 'params' puts these in the URL: /getDetailedNotes?standard=6&subject=Science...
    const { data } = await apiClient.get(`/gemmaai/notes/getDetailedNotes`, { params });
    // alert("Chapter Details: " + JSON.stringify(data));
    console.log("Chapter Details: ", data.erpSystemResponse.lstDetailedNotesSections);
    return data.erpSystemResponse.lstDetailedNotesSections;
};



export const getNotesBatchChapterDetails = async (chapterId: number) => {

    try {
        const { data } = await aiClient.get(`/learningplatform/notesbatch/getNotesBatchChapterDetails`, { params: { chapterId } })

        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(
                    error.response.data?.message || error.response.data
                );
            }
        }
        throw new Error("Network error " + error);
    }
}

export const getChapterList = async (params: {
    key: string;
}) => {
    try {
        const response = await aiClient.get("/genai/notes/chapterList", {
            params, // query params
        });

        // console.log("Chapter List: 111111", response.data.lstChapters);
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

export const getAnswer = async (payload: StudentQuestionType) => {
    try {
        // Change from .get to .post, pass payload directly as request body
        const response = await apiClient.post("/gemmaai/notes/getAnswer", payload);

        // Handle your nested ErpsystemResponse object mapping structure cleanly:
        // Your backend returns an object wrapper, inside which sits erpSystemResponse or response data map
        const dataPayload = response.data?.erpSystemResponse || response.data;
        console.log("answerList List:", dataPayload?.answerList);
        return dataPayload?.answerList || [];
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