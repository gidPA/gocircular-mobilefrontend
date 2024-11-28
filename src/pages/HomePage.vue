<template>
    <ion-page>
        <ion-content>
            <ion-header class="ion-no-border">
                <ion-avatar slot="end" router-link="/profile-view">
                    <img src="/src/assets/pp_placeholder.png" />
                </ion-avatar>
            </ion-header>
            <div class="homepage">
                <div>
                    <ion-text class="ion-text-center">
                        <p>Welcome, {{ username }}</p>
                        <h1>
                            Your Balance
                        </h1>
                        <h1>
                            {{ accountBalance }}
                        </h1>
                    </ion-text>
                </div>


                <div class="homepage-buttons">
                    <ion-button expand="full" router-link="/qr-code-scan" class="scan-button">
                        <h1>Exchange <br> Recyclables</h1>
                    </ion-button>

                    <ion-button expand="full" router-link=/point_exchange>
                        Exchange Points
                    </ion-button>

                    <ion-button expand="full" router-link="/history">
                        View Transaction History
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
    IonHeader,
    IonAvatar
} from '@ionic/vue'
import { ref } from 'vue';

import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/useAuthStore';
import { requestWithToken } from '@/helpers/tokenedRequestWrapper';


const authStore = useAuthStore();
const { username } = storeToRefs(authStore);
const accountBalance = ref(0);

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
</script>

<style scoped>
.homepage {
    display: flex;
    flex-direction: column;
    height: 80vh;
    justify-content: space-around;
    align-items: center;

    padding-top: 5%;
}

.homepage-buttons {
    width: 80vw;
}

ion-header {
    padding-top: 20px;
    padding-bottom: 10px;
    padding-right: 25px;

    display: flex;
    justify-content: flex-end;
}

ion-avatar {
    width: 45px;
    height: 45px;
}
</style>