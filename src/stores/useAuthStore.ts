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
            username: null as string | null,
            email: null as string | null,
        }
    },
    actions: {
        async login(credentials: Credentials) {
            try {
                // Replace with your API endpoint
                const response = await axios.post(
                    `${import.meta.env.VITE_GOCIRCULAR_API_URL}/user/login`,
                    credentials,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }

                )

                const data = response.data;
                console.log(response.data);

                this.accessToken = data.accessToken;
                this.refreshToken = data.refreshToken;
                this.userid = data.userid;
                this.username = data.username;
                this.email = data.email;

                // Save tokens to Ionic Storage
                await storage.set('accessToken', data.accessToken);
                await storage.set('refreshToken', data.refreshToken);
                await storage.set('userid', data.userid);
                await storage.set('username', data.username);
                await storage.set('email', data.email);
            } catch (error) {
                console.error('Login error:', error);
                // Handle error (e.g., show a notification)
            }
        },

        async logout() {

            await axios.post(
                `${import.meta.env.VITE_GOCIRCULAR_API_URL}/user/logout`,
                {
                    userID: this.userid,
                    refreshToken: this.refreshToken
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.refreshToken}`,
                        'Content-Type': 'application/json',
                    }
                }
            )

            this.accessToken = null;
            this.refreshToken = null;
            this.userid = null;
            this.username = null;
            this.email = null;


            // Remove tokens from Ionic Storage
            await storage.remove('accessToken');
            await storage.remove('refreshToken');
            await storage.remove('userid');
            await storage.remove('username');
            await storage.remove('email');
        },

        async refreshAccessToken() {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_GOCIRCULAR_API_URL}/user/renew`,
                    {refreshToken: this.refreshToken},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
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
            const username = await storage.get('username');
            const email = await storage.get('email');


            if (accessToken && refreshToken && userid) {
                this.accessToken = accessToken;
                this.refreshToken = refreshToken;
                this.userid = userid;
                this.username = username;
                this.email = email;

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
