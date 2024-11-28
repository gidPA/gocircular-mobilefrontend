<template>
    <ion-page>
        <ion-content>
            <div class="profile-page">
                <div class="user-profile">
                    <ion-avatar>
                        <img src="/src/assets/pp_placeholder.png" router-link="/profile-view" />
                    </ion-avatar>
                    <div>
                        <ion-text>
                            <h1>{{ username }}</h1>
                            <p>{{ email }}</p>
                        </ion-text>
                    </div>
                </div>

                <div class="buttons">
                    <ion-button expand="full">
                        Edit Profiles
                    </ion-button>
                    <ion-button expand="full" v-on:click="handleLogout">
                        Log Out
                    </ion-button>
                </div>
            </div>






        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonText,
    IonContent,
    IonButton,
    onIonViewWillEnter,
    IonAvatar
} from '@ionic/vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/useAuthStore';
import { requestWithToken } from '@/helpers/tokenedRequestWrapper';


const authStore = useAuthStore();
const { username, email } = storeToRefs(authStore);
const accountBalance = ref(0);
const router = useRouter();



onIonViewWillEnter(async () => {
    try {
        const accountDetails = await requestWithToken(
            "get",
            `${import.meta.env.VITE_GOCIRCULAR_API_URL}/user/view/${authStore.userid}`,
        );

        console.log(accountDetails);
        console.log(accountDetails?.data.currentPoints);

        console.log(username.value);
        accountBalance.value = accountDetails?.data.currentPoints
    } catch (err) {
        console.log(err);
    }

})

async function handleLogout(){
    authStore.logout();
    router.replace("/login");
}
</script>

<style scoped>
.profile-page {
    display: flex;
    flex-direction: column;
    height: 80vh;
    justify-content: space-around;
    align-items: center;

    padding-top: 5%;
    padding-left: 5%;
    padding-right: 5%;
}

.homepage-buttons {
    width: 80vw;
}

ion-avatar {
    width: 75px;
    height: 75px;
    margin-right: 7%
}

.user-profile {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    width: 90%;

}

.buttons {
    width: 100%;
}

/* ion-text h1{
} */
</style>