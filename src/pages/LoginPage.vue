<template>
    <ion-page>
        <ion-content>
            <div class="base-layout">
                <ion-img src="/mobile/src/assets/Logo_large.png" class="logo">

                </ion-img>

                <ion-text class="ion-text-center">
                    <h1>GoCircular <br> Companion App</h1>
                </ion-text>

                <div class="login-form">
                    <ion-list>
                        <ion-item>
                            <ion-input label="Email Address" label-placement="floating" type="email"
                                v-model="enteredEmailAddress" required>
                            </ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-input label="Password" label-placement="floating" type="password"
                                v-model="enteredPassword" required></ion-input>
                        </ion-item>
                    </ion-list>
                    <div class="warning-message">
                        <ion-text v-if="loginFailed" color="danger">
                            <p>Incorrect username or password</p>
                        </ion-text>

                    </div>
                    <ion-button expand="full" @click="handleLogin">Login</ion-button>

                </div>
                <ion-text class="ion-text-center" color="medium">
                    <p>Not a member? <RouterLink to="/register">Register now</RouterLink></p>
                </ion-text>
            </div>


        </ion-content>
    </ion-page>

</template>

<script setup lang="ts">
import {
    IonImg,
    IonPage,
    IonText,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonButton,
} from '@ionic/vue'
import { ref } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from '@/stores/useAuthStore';
import { AxiosError } from 'axios';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const enteredEmailAddress = ref("");
const enteredPassword = ref("");
const loginFailed = ref(false);


//login method
const handleLogin = async () => {
    try {
        console.log("Loggin in...")

        await authStore.login({
            email: enteredEmailAddress.value,
            password: enteredPassword.value
        })

        if (authStore.accessToken) {
            const redirectPath = route.query.redirect || "/";
            router.replace(redirectPath);
        } else {
            loginFailed.value = true;
        }
    } catch (err) {

        console.log(err);
        if (err instanceof AxiosError){
            if (err.response?.status === 401){
                loginFailed.value = true;
        }
    }
}

}
</script>

<style scoped>
.logo {
    width: 30vh;
    height: 30vh;
}

.warning-message{
    height: 60px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.warning-message p{
    margin: 6px;
}
</style>