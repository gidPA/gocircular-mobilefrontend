// src/stores/useAuthStore.js
import { defineStore } from 'pinia';
import storage from '@/utils/storage';
// import { useRouter } from 'vue-router';
import axios from 'axios';

export interface Credentials {
    email: string,
    password: string,
}
    
export interface AuthResponse {
    accessToken: string | null,
    refreshToken: string | null,
    userid: number | null,
    role: string | null
}           

export const useAuthStore = defineStore('auth', {
    state() {
        return {
            accessToken: null as string | null,
            refreshToken: null as string | null,
            userid: null as number | null,
        }
    },
    actions: {
        async login(credentials: Credentials) {
            try {
                // Replace with your API endpoint
                const response = await axios.post(
                    `${import.meta.env.VITE_GOCIRCULAR_API_URL}/user/login`,
                    JSON.stringify(credentials),
                    {
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }

                )

                const data = response.data;

                this.accessToken = data.accessToken;
                this.refreshToken = data.refreshToken;
                this.userid = data.userid;

                // Save tokens to Ionic Storage
                await storage.set('accessToken', data.accessToken);
                await storage.set('refreshToken', data.refreshToken);
                await storage.set('userid', data.userid);
                await storage.set('role', data.role);
            } catch (error) {
                console.error('Login error:', error);
                // Handle error (e.g., show a notification)
            }
        },

        async logout() {
            this.accessToken = null;
            this.refreshToken = null;
            this.userid = null;


            // Remove tokens from Ionic Storage
            await storage.remove('accessToken');
            await storage.remove('refreshToken');
            await storage.remove('userid');
            await storage.remove('role');
        },

        async refreshAccessToken() {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_GOCIRCULAR_API_URL}/user/login`,
                    JSON.stringify({refreshToken: this.refreshToken})
                )
                this.accessToken = response.data.accessToken;
                this.refreshToken = response.data.refreshToken;
                await storage.set('accessToken', response.data.accessToken);
                await storage.set('refreshToken', response.data.refreshToken);

            } catch (error) {
                console.error('Token refresh error:', error);
                this.logout();
            }
        },

        async checkAuth() {
            const accessToken = await storage.get('accessToken');
            const refreshToken = await storage.get('refreshToken');
            const userid = await storage.get('userid');

            if (accessToken && refreshToken && userid) {
                this.accessToken = accessToken;
                this.refreshToken = refreshToken;
                this.userid = userid;


                // Optional: Validate the access token with a fetch request
                // If expired, call refreshAccessToken()
                await this.refreshAccessTokenIfNeeded();

                return true;
            }
            else{
                return false;
            }
        },

        async refreshAccessTokenIfNeeded() {
            // Optionally check if the access token is expired
            // If expired, call this.refreshAccessToken()
            if (this.isTokenExpired(this.accessToken as string)) {
                await this.refreshAccessToken();
            }
        },

        isTokenExpired(token: string) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiryTime = payload.exp * 1000; // Convert to milliseconds
            return Date.now() > expiryTime;
        },
    },
});
