import axios from "axios";
import type { customer, post } from "./types/postType";

import type { LoginType, MetaDataType, PublishUploadType, StudentType, UpdateUserRoleType, UserType } from "./types/userType";
import apiClient from "./service/ApiClient";
const api = axios.create({
    baseURL: "https://dummyjson.com"
});

export const getAllPost = async (): Promise<post[]> => {
    const response = await api.get("/posts");

    const data: post[] = response.status === 200 ? response.data.posts : []
    // console.log(data)
    return data;
}





export const createMutationCustomer = async (newCustomer: customer) => {
    const response = await apiClient.post("/customer", newCustomer);
    console.log(response.status);
}

export const getCustomerList = async (): Promise<customer[]> => {
    const response: customer[] = (await apiClient.get("/customer/all")).data.erpSystemResponse.customerList;
    return response;
}

export const delteCustomer = async (customerId: number): Promise<void> => {
    await apiClient.delete(`/${customerId}`)
}





export const mutationCreateUser = async (newUser: UserType) => {

    // console.log(response.status);

    try {
        await apiClient.post("/user/signup", newUser);
    } catch (error: any) {
        if (error.response) {
            // alert(error.response.data.erpSystemResponse.message)
            throw new Error(error.response.data.erpSystemResponse.message || "Registration failed");
        }
        throw new Error("Network error");
    }
}

export const getAllUser = async (): Promise<UserType[]> => {
    try {
        const response = await apiClient.get("/user/all");
        const data = response.status === 200 ? response.data.erpSystemResponse.userList : []
        //const data: post[] = response.status === 200 ? response.data.posts : []
        // console.log(data)
        return data;
    } catch (error: any) {
        if (error.response) {
            alert(error.response.data.erpSystemResponse)
            throw new Error(error.response.data.erpSystemResponse || "Registration failed");

        }
        throw new Error("Network error");
    }
}

export const mutationCreateLogin = async (newLogin: LoginType) => {

    try {
        const response = await apiClient.post("/login/validate", newLogin);
        // console.log(response.data.erpSystemResponse);
        if (response.data.erpSystemResponse.jwtToken) {
            // localStorage.setItem("jwtToken", response.data.erpSystemResponse.jwtToken);
            // localStorage.setItem("loggedInUser", JSON.stringify(response.data.erpSystemResponse.loggedInUser));
            sessionStorage.setItem("jwtToken", response.data.erpSystemResponse.jwtToken);
        }

        // console.log(response.status, response.data.erpSystemResponse);
    } catch (error: any) {
        if (error.response) {
            // alert(error.response.data.erpSystemResponse.message)
            throw new Error(error.response.data.erpSystemResponse.message || "Registration failed");
        }
        throw new Error("Network error");
    }
}

export const mutationCreateStudent = async (newStudent: StudentType) => {
    try {
        await apiClient.post("/user/parent/enrollStudent", newStudent);
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data?.erpSystemResponse?.message || error.response.data);
            }
        }
        throw new Error("Network error " + error);
    }

}

export const getAllStudentForParent = async (id: string | number): Promise<StudentType[]> => {
    try {
        const response = await apiClient.get(`/user/parent/${id}/students`);
        const data = response.status === 200 ? response.data.erpSystemResponse.studentList : []
        return data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data?.erpSystemResponse?.message || error.response.data);
            }
        }
        throw new Error("Network error " + error);
    }
}

export const uploadFile = async (formData: FormData) => {

    try {
        const response = await apiClient.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data?.erpSystemResponse?.message || error.response.data);
            }
        }
        throw new Error("Network error " + error);
    }
};

export const getAllUploadedFilesList = async (): Promise<string[]> => {
    try {
        const response = await apiClient.get("/upload/all");
        const data = response.status === 200 ? response.data.erpSystemResponse.uploadedFilesList : []
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data?.erpSystemResponse?.message || error.response.data);
            }
        }
        throw new Error("Network error " + error);
    }
}

export const mutationCreateUpload = async (newUpload: PublishUploadType) => {
    try {
        await apiClient.post("/upload", newUpload);
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data?.erpSystemResponse?.message || error.response.data);
            }
        }
        throw new Error("Network error " + error);
    }

}


export const mutationPublishUpload = async (newUpload: PublishUploadType) => {
    try {
        // console.log("Inside mutationPublishUpload Api.tsx", newUpload);
        await apiClient.post("/upload/publishUpload", newUpload);
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data?.erpSystemResponse?.message || error.response.data);
            }
        }
        throw new Error("Network error " + error);
    }

}


export const getMetaDataRole = async (key: string): Promise<MetaDataType[]> => {

    //ADMIN, TEACHER, STUDENT, PARENT, USER


    try {
        const response = await apiClient.get(`/metadata?key=${key}`);
        console.log("getMetaDataRole response:", response);
        const data: MetaDataType[] = response.status === 200 ? response.data.erpSystemResponse.metaDataList : []
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data?.erpSystemResponse?.message || error.response.data);
            }
        }
        throw new Error("Network error " + error);
    }
}
export const getUserRole = async (email: string) => {
    try {
        // alert("Inside getUserRole Api.tsx: " + email);
        const response = await apiClient.get(`/admin/userrole?userEmailId=${email}`);
        console.log("getUserRole response:", response);
        return response.data; // ✅ success case
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data?.erpSystemResponse?.message || error.response.data);
            }
        }
        throw new Error("Network error " + error);
    }
};




export const updateUserRoles = async (updateUserRoleType: UpdateUserRoleType) => {
    try {
        // console.log("Inside updateUserRoles Api.tsx", newUpload);
        console.log("Inside updateUserRoles Api.tsx: ", updateUserRoleType);
        alert("Inside updateUserRoles Api.tsx: " + updateUserRoleType);
        const response = await apiClient.put("/admin/userrole/update", updateUserRoleType);
        return response.data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data?.erpSystemResponse?.message || error.response.data);
            }
        }
        throw new Error("Network error " + error);
    }

}


