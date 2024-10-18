<template>
    <ion-page>
        <ion-content>
            <div class="base-layout">
                <ion-img src="/mobile/src/assets/success_checkmark.png" class="logo">
                </ion-img>

                <ion-text class="ion-text-center">
                    <h1>Success!</h1>
                    <p>Your account has been created</p>
                </ion-text>
                <ion-button expand="full" @click="handleLoginButton">
                    Log in to your account
                </ion-button>
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
    IonButton,
} from '@ionic/vue'
import { useRouter,} from "vue-router";


const router = useRouter();

const handleLoginButton = () => {
    router.replace("/login");
}





</script>

<style scoped>
.logo {
    width: 40vh;
    height: 40vh;
}


</style>