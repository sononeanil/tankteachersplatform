// hooks/usePublishCourseList.ts
import { useQuery } from "@tanstack/react-query";
import { getCourseDetails, getPublishCourseList } from "../service/ApiPublishCourse";

export const usePublishCourseList = () => {
    return useQuery({
        queryKey: ["publishCourses"],   // 🔑 unique cache key
        queryFn: getPublishCourseList,  // API function
    });
};

export const useGetCourseDetails = (courseId: number) => {
    return useQuery({
        queryKey: ["getCourseDetails", courseId],   // 🔑 unique cache key
        queryFn: () => getCourseDetails(courseId),  // API function
    });
};