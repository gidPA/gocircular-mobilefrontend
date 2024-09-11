<template>
    <ion-page>
        <ion-content>
            <ion-text class="ion-text-center">
                <h1>GoCircular Companion App</h1>
            </ion-text>

            <form class="ion-padding">
                <ion-list>
                    <ion-item>
                        <ion-input
                            label="Email Address"
                            label-placement="floating"
                            type="email"
                            v-model="enteredEmailAddress"
                            required>
                        </ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-input
                        label="Password"
                        label-placement="floating"
                        type="password"
                        v-model="enteredPassword"
                        required></ion-input>
                    </ion-item>
                </ion-list>
            </form>
            <ion-button expand="full" @click="handleLogin">Login</ion-button>

        </ion-content>
    </ion-page>

</template>

<script setup lang="ts">
import {
    IonPage,
    IonText,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonButton,
} from '@ionic/vue'
import { ref } from 'vue';
import {useRouter, useRoute} from "vue-router";
import { useAuthStore } from '@/stores/useAuthStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const enteredEmailAddress = ref("");
const enteredPassword = ref("");


//login method
const handleLogin = async () => {
    try{
        console.log("Loggin in...")

        await authStore.login({
        email: enteredEmailAddress.value,
        password: enteredPassword.value
        })

        if(authStore.accessToken){
            const redirectPath = route.query.redirect || "/";
            router.push(redirectPath);
        }
    }catch(err){
        console.log(err);
    }

}
</script>