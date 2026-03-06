import axios from "axios";

const apiAdmin = axios.create({
    baseURL: "http://localhost:8080/erpsystem"
    // baseURL: "https://tankstudentportalrestapi-production.up.railway.app/erpsystem"
})

apiAdmin.interceptors.request.use(
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

export const getZoomMeetingSignature = async (role: number) => {
    try {
        const response = await apiAdmin.get(`/zoom/signature?role=${role}`);

        const data = response.status === 200 ? response.data.erpSystemResponse : []
        console.log("Signature response ---->" + data.signature + " meetingNumber: " + data.meetingNumber + "," + data.password);
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