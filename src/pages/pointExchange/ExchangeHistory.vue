<template>
    <ion-page>
        <ion-content>

            <div class="transaction-div">
                <div class="title-with-back">
                    <ion-item  lines="none">
                        <ion-back-button default-href="/" slot="start"></ion-back-button>

                    </ion-item>
                    <ion-text class="ion-text-center">
                        <p>Your current balance</p>
                        <h1>{{accountBalance}}</h1>
                    </ion-text>
                </div>

                <div class="exchange-history">
                    <ion-text class="ion-text-left expand-fully">
                        Exchange History
                    </ion-text>
                    <ion-list>

                        <ion-item 
                            v-for="item in transactionItem" 
                            v-bind:key="item.transactionID"
                            class="ion-activatable ripple-parent ion-no-border"
                            @button="true"
                            @click="seeDetails(item.transactionID, item.status)"
                        >
                            <ion-label>
                                <h2>Exchange {{ item.transactionID }}</h2>
                                <p>{{item.transactionDate}}</p>
                            </ion-label>
                            <ion-label slot="end" class="ion-text-center" style="width: 40%">
                                <h2>{{ item.requested_point }}</h2>
                                <ion-text :color="colorSelection(item.status)">
                                    <p class="item-subtitle">{{ item.status }}</p>
                                </ion-text>
                            </ion-label>
                        </ion-item>
                    </ion-list>
                </div>

                <ion-button expand="full" style="width: 90%" router-link="/point_exchange/new">
                    Request New Point Exchange
                </ion-button>
            </div>

        </ion-content>
    </ion-page>

</template>

<script setup lang="ts">
import { requestWithToken } from "@/helpers/tokenedRequestWrapper";
import { convertTZ } from "@/utils/convertDateStringTimezone";
import {
    IonPage,
    IonContent,
    IonItem,
    IonList,
    IonLabel,
    IonText,
    onIonViewWillEnter,
    IonBackButton,
    IonButton
} from "@ionic/vue"
import { AxiosResponse } from "axios";
import { ref } from "vue";
import {useRouter} from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/useAuthStore";

interface TransactionData {
    transactionID: number,
    transactionDate: string,
    status: string,
    userID: number,
    requested_point: number,
    modified_at: string,
}

const router = useRouter();
const authStore = useAuthStore();
const {userid} = storeToRefs(authStore);

const transactionItem = ref([] as Array<TransactionData>);
const accountBalance = ref(0);

const colorSelection = (status: string) => {
    switch(status){
        case "PENDING":
            return "warning";
        case "COMPLETED":
            return "primary";
        case "REJECTED":
            return "danger";
        case "CANCELLED":
            return "danger";
        default:
            return "";
    }
}

const seeDetails = (id: number, status: string) => {
    if (status === "PENDING"){
        router.push({
            path: `/point_exchange/new/success`,
            query:{
                exchangeid: id
            }
        });
    }
}

onIonViewWillEnter(async () => {
    try {
        const accountDetails = await requestWithToken(
            "get",
            `${import.meta.env.VITE_GOCIRCULAR_API_URL}/user/view/${authStore.userid}`,
        );
        accountBalance.value = accountDetails?.data.currentPoints

        const response:AxiosResponse = await requestWithToken(
            "get",
            `${import.meta.env.VITE_GOCIRCULAR_API_URL}/point_exchange/list?userid=${userid.value}`
        );

        console.log(response?.data);

        const responseData = response.data.items;

        responseData.forEach((data: TransactionData) => {
            data.transactionDate = convertTZ(data.transactionDate, "Asia/Jakarta");
            if (data.modified_at) {
                data.modified_at = convertTZ(data.modified_at, "Asia/Jakarta");
            }
        })
        transactionItem.value = responseData;
    } catch (err) {
        console.log(err);
    }


});


</script>

<style scoped>
.exchange-history {
    width: 90%;
    height: 75%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

ion-list {

    padding-top: 2px;
    padding-left: 1px;
    padding-right: 10px;
    padding-bottom: 15px;

    border-style: solid;
    border-width: 3px;
    border-color: #d1d1d1;
    border-radius: 10px;

    width: 100%;
    height: 90%;

    overflow-y: auto;
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



ion-grid {
    padding-top: 15px;
    width: 80vw;
    --ion-grid-columns: 10;
    flex: 0;
}

.item-subtitle {
    text-transform: capitalize;
    font-size: 10pt;
}


.title-with-back {
    width: 98%
}

.ripple-parent {
    position: relative;
    overflow: hidden;
}
</style>
