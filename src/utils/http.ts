import { useAuthStore } from '@/stores/useAuthStore';
import axios, { AxiosRequestConfig } from 'axios';

export enum ApiRequestMethods {
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete"
}

export async function apiRequest(url: string, method: ApiRequestMethods, options:AxiosRequestConfig = {}) {
    const authStore = useAuthStore();

    if (authStore.isTokenExpired(authStore.accessToken as string)) {
        await authStore.refreshAccessToken();
    }

    options.baseURL = import.meta.env.VITE_GOCIRCULAR_API_URL;
    options.url = url;
    options.method = method;

    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${authStore.accessToken}`,
    };

    const response = await axios(options);


    if (response.status === 401) {
        // Access token expired or invalid
        await authStore.refreshAccessToken();

        // Retry the request with the new access token
        options.headers.Authorization = `Bearer ${authStore.accessToken}`;
        return axios(options);
    } else if(response.status >= 400 && response.status < 600){
        throw new Error(`Got Error ${response.status}, with code ${response.statusText}`)
    }

    return response;
}