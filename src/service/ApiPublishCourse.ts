import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { PublishCourseType } from "../types/publishCourseTypes";

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