// hooks/usePublishCourseList.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCourseDetails, getPublishCourseList, getPublishCourseListTop6, registerForCourse } from "../service/ApiPublishCourse";
import { useToast } from "@chakra-ui/react";

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



export const useRegisterCourse = () => {
    const toast = useToast();

    return useMutation({
        mutationFn: registerForCourse,
        onSuccess: () => {
            toast({
                title: "Registration successful 🎉",
                description: "You have been registered for the course.",
                status: "success",
                duration: null,
                isClosable: true,
                position: "top",
            });
        },

        onError: (error: any) => {
            toast({
                title: "Registration failed ❌",
                description: error?.message || "Something went wrong.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right",
            });
        }
    });
};

export const usePublishCourseListTop6 = () => {
    return useQuery({
        queryKey: ["publishCoursesTop6"],   // 🔑 unique cache key
        queryFn: getPublishCourseListTop6,
        // API function
    });
};
