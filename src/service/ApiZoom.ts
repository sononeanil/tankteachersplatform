import type { CreateZoomMeetingType, startZoomMeetingType } from "../types/zoom";
import apiClient from "./ApiClient";



export const getZoomMeetingSignature = async (role: number) => {
    try {
        const response = await apiClient.get(`/zoom/signature?role=${role}`);

        const data = response.status === 200 ? response.data.erpSystemResponse : []
        // console.log("Signature response ---->" + data.signature + " meetingNumber: " + data.meetingNumber + "," + data.password);
        //const data: post[] = response.status === 200 ? response.data.posts : []

        return data;
    } catch (error: any) {
        if (error.response) {
            console.log("Error response data:", error, error.response.data);
            throw new Error(error.response.data || "Unable to fetch zoom signature");
        }
        throw new Error("Network error");
    }
}

export const createZoomMeeting = async (newZoom: CreateZoomMeetingType) => {
    try {
        const response = await apiClient.post("/zoom/setup", newZoom);
        const data = response.status === 200 ? response.data.erpSystemResponse : null;
        return data;
    } catch (error: any) {
        if (error.response) {
            console.log("Error response data:", error, error.response.data);
            throw new Error(error.response.data.
                erpSystemResponse.message || "Unable to create zoom meeting");
        }
        throw new Error("Network error while creating zoom meeting");
    }
}

export const getUpcomingMeetings = async () => {
    try {
        const response = await apiClient.get("/student/upcoming");
        const data = response.status === 200 ? response.data.erpSystemResponse.upcomingMeetingList : [];
        console.log("Upcoming meetings response ---->", data);
        return data;
    } catch (error: any) {
        if (error.response) {
            console.log("Error response data 111111:", error, error.response.data);
            throw new Error(error.response.data || "Unable to fetch upcoming meetings");
        }
        throw new Error("Network error while creating zoom meeting");
    }
}

export const getUpcomingMeetingsForTeacherApi = async (teacherEmailId: string): Promise<startZoomMeetingType[]> => {
    // alert("Teacher email ID: " + teacherEmailId);
    try {
        const response = await apiClient.get(`/teacher/upcomingMeetings?teacherEmailId=${teacherEmailId}`);
        // console.log("Teacher response 11111:", response);
        // console.log("Teacher response: 2222", JSON.stringify(response.data, null, 2));
        const data = response.status === 200 ? response.data.erpSystemResponse.upcomingMeetingListForTeacher : [];
        // alert("Upcoming meetings response ---->" + JSON.stringify(data));
        console.log("Upcoming meetings response 3333---->", response.data.erpSystemResponse.upcomingMeetingListForTeacher);
        return data;
    } catch (error: any) {
        if (error.response) {
            console.log("Error response data:", error, error.response.data);
            throw new Error(error.response.data || "Unable to fetch upcoming meetings");
        }
        throw new Error("Network error while creating zoom meeting");
    }
}