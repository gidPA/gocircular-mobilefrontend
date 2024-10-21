import { useAuthStore } from "@/stores/useAuthStore";
import axios, { AxiosRequestConfig } from "axios";

export async function requestWithToken(method: string, url: string, header = {}, body?: any) {
    console.log("doing protected request...");

    let reqMethod = method.toLowerCase();

    if (reqMethod === 'get' || reqMethod === 'post' || reqMethod === 'put' || reqMethod === 'delete') {
        reqMethod = 'get'
    }

    const authStore = useAuthStore();
    if (!authStore.accessToken) {
        try {
            authStore.refreshAccessToken();
        } catch (err) {
            console.log(err);
            return;
        }
    }else{
        console.log("Ready to go");
    }

    const reqHeaders = {
        ...header,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authStore.accessToken}`
    }

    let axiosOptions: AxiosRequestConfig = {
        method: reqMethod,
        url: url,
        headers: reqHeaders
    }

    if (body) {
        axiosOptions = {
            ...axiosOptions,
            data: body
        }
    }

    let response = await axios(axiosOptions);

    if (response.status === 403) {
        authStore.refreshAccessToken();
        response = await requestWithToken(method, url, header, body);
    }
    return response;

}