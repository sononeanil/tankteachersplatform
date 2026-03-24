import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { PublishCourseType, RegisterCourseType } from "../types/publishCourseTypes";

const apiPublishCourse = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/erpsystem"
})

apiPublishCourse.interceptors.request.use(
    (config) => {
        const jwtToken = localStorage.getItem("jwtToken");
        if (jwtToken) {
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const usePublishCourse = () => {
    return useMutation({
        mutationFn: async (data: PublishCourseType) => {
            const res = await apiPublishCourse.post("/teacher/course/publish", data);
            return res.data;
        },
    });
};

export const getPublishCourseList = async (): Promise<PublishCourseType[]> => {
    try {
        const response = await apiPublishCourse.get("/login/publishCourse/all");
        const data: PublishCourseType[] = response.status === 200 ? response.data.erpSystemResponse.publishCourseList : [];
        // console.log("Fetched publish courses:", data);
        return data;
    } catch (error: any) {
        if (error.response) {
            // console.log("Error response data:", error, error.response.data);
            throw new Error(
                error.response.data.erpSystemResponse.message ||
                "Unable get available courses. Please try again later."
            );
        }
        throw new Error("Network error while fetching available courses. Please check your connection and try again.");
    }
};


export const getPublishCourseListTop6 = async (): Promise<PublishCourseType[]> => {
    try {
        const response = await apiPublishCourse.get("/login/publishCourse/top6");
        const data: PublishCourseType[] = response.status === 200 ? response.data.erpSystemResponse.publishCourseListTop6 : [];
        return data;
    } catch (error: any) {
        if (error.response) {
            // console.log("Error response data:", error, error.response.data);
            throw new Error(
                error.response.data.erpSystemResponse.message ||
                "Unable get available courses. Please try again later."
            );
        }
        throw new Error("Network error while fetching available courses. Please check your connection and try again.");
    }
};

export const getCourseDetails = async (courseId: number): Promise<PublishCourseType> => {
    try {
        const response = await apiPublishCourse.get(`/login/publishCourse?courseId=${courseId}`);
        // console.log("11111111111111 -> Fetched course details:", response);
        const data: PublishCourseType = response.status === 200 ?
            response.data.erpSystemResponse.courseDetails : {};

        return data;
    } catch (error: any) {
        if (error.response) {
            // console.log("Error response data:", error, error.response.data);
            throw new Error(
                error.response.data.erpSystemResponse.message ||
                "Unable get details. Please try again later."
            );
        }
        throw new Error("Network error while fetching available courses. Please check your connection and try again.");
    }
};

export const registerForCourse = async (newCourseRegister: RegisterCourseType) => {
    try {
        await apiPublishCourse.post("/login/publishCourse/register", newCourseRegister);
    } catch (error: any) {
        if (error.response) {
            // console.log("Error response data:", error, error.response.data);
            throw new Error(
                error.response.data.erpSystemResponse.message ||
                "Unable to Register for course. Please try again later."
            );
        }
        throw new Error("Network error while fetching available courses. Please check your connection and try again.");
    }
};


export const getQrCode = async (teacherEmailId: string) => {
    try {
        const response = await apiPublishCourse.get(`/login/publishCourse/qr?teacherEmailId=${teacherEmailId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            // console.log("Error response data:", error, error.response.data);
            throw new Error(
                error.response.data.erpSystemResponse.message ||
                "Unable to Register for course. Please try again later."
            );
        }
        throw new Error("Network error while fetching available courses. Please check your connection and try again.");
    }
};