<template>
    <ion-page>
        <ion-content>

            <div class="transaction-div">
                <div class="title-with-back">
                    <ion-item  lines="none">
                        <ion-back-button default-href="/point_exchange" slot="start"></ion-back-button>
                    </ion-item>
                    <ion-text class="ion-text-center">
                        <h2>Request New Exchange</h2>
                    </ion-text>
                </div>
                <ion-grid class="point-exchange-options" style="width: 90%;">
                    <ion-row>
                        <ion-col size="1">
                            <ion-button expand="full" size="large" @click="setAmount(500)">
                                500
                            </ion-button>
                        </ion-col>
                        <ion-col size="1" >
                            <ion-button expand="full" size="large" @click="setAmount(1000)">
                                1000
                            </ion-button>
                        </ion-col>
                    </ion-row>

                    <ion-row>
                        <ion-col size="1">
                            <ion-button expand="full" size="large" @click="setAmount(2000)">
                                2000
                            </ion-button>
                        </ion-col>
                        <ion-col size="1" >
                            <ion-button expand="full" size="large" @click="setAmount(5000)">
                                5000
                            </ion-button>
                        </ion-col>
                    </ion-row>

                    <ion-row>
                        <ion-col size="1">
                            <ion-button expand="full" size="large" @click="setAmount(10000)">
                                10000
                            </ion-button>
                        </ion-col>
                        <ion-col size="1" >
                            <ion-button expand="full" size="large" @click="setAmount(50000)">
                                50000
                            </ion-button>
                        </ion-col>
                    </ion-row>
                    
                </ion-grid>

                <ion-grid class="point-exchange-details" style="width: 90%;">
                    <ion-row>
                        <ion-col>
                            <ion-text>
                                <h6>Selected Exchange amount</h6>
                            </ion-text>
                        </ion-col>
                        <ion-col>
                            <ion-text class="ion-text-right" >
                                <h1 style="padding-right: 15px;">{{ exchangeAmount }}</h1>
                            </ion-text>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                            <ion-text>
                                <h6>Your Current Balance</h6>
                            </ion-text>
                        </ion-col>
                        <ion-col>
                            <ion-text class="ion-text-right" >
                                <h1 style="padding-right: 15px;">{{accountBalance}}</h1>
                            </ion-text>
                        </ion-col>
                    </ion-row>
                </ion-grid>
                <ion-button expand="full" style="width: 90%" @click="submitRequest" :disabled="exchangeAmount === 0">
                    Request New Point Exchange
                </ion-button>
            </div>

        </ion-content>
    </ion-page>

</template>

<script setup lang="ts">
import {
    IonPage,
    IonContent,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonBackButton,
    IonButton,
    onIonViewWillEnter
} from "@ionic/vue"
import { ref } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from "vue-router";
import { requestWithToken } from '@/helpers/tokenedRequestWrapper';
import {apiRequest, ApiRequestMethods} from "@/utils/http";
import { AxiosError } from "axios";
const exchangeAmount = ref(0);



const authStore = useAuthStore();
const router = useRouter();
const { username } = storeToRefs(authStore);
const accountBalance = ref(0);

const setAmount = (amount: number) => {
    exchangeAmount.value = amount;
}

const submitRequest = async () => {
    try{
        if (exchangeAmount.value > accountBalance.value){
            router.replace({
                path: "/point_exchange/new/failed",
                query: {
                    failid: 422
                }
            });
            return;
        }

        const response = await apiRequest(
            '/point_exchange/new',
            ApiRequestMethods.POST,
            {
                data: {
                    userID: authStore.userid,
                    exchangeAmount: exchangeAmount.value
                }
            }
        )
        
        if(response?.status >= 200 && response.status <= 300){
            router.replace({
                path: '/point_exchange/new/success',
                query: {
                    exchangeid: response?.data.requestID,
                }
            })
        }

    } catch(err){
        if(err instanceof AxiosError){
            router.replace({
                path: "/point_exchange/new/failed",
                query: {
                    failId: err.status
                }
            })
        }

        console.log(err);
    }

    
}

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

.point-exchange-options {
    --ion-grid-columns: 2;
}

.point-exchange-options {
    --ion-grid-columns: 2;
}

.transaction-div {
    display: flex;
    flex-direction: column;
    height: 95vh;
    justify-content: space-between;
    align-items: center;

    padding-top: 5%;
}


.expand-fully {
    width: 100%;
    padding-left: 10px;
    margin-bottom: 10px;
}

.item-subtitle {
    text-transform: capitalize;
    font-size: 10pt;
}


.title-with-back {
    width: 98%
}
</style>
