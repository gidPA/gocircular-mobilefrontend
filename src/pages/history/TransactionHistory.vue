<template>
    <ion-page>
        <ion-content>
            <div class="transaction-div">
                <ion-item class="title-with-back" lines="none">
                    <ion-back-button default-href="/" slot="start"></ion-back-button>
                    <ion-text class="ion-text-center">
                        <h1>Transaction History</h1>
                    </ion-text>
                </ion-item>

                <ion-list>
                    <ion-item 
                        v-for="item in historyItems" 
                        :key="item.transactionID"
                        :router-link="`/history/${item.transactionID}`"
                    >
                        <ion-label>
                            <h2 class="transaction-id">Transaction {{ item.transactionID }}</h2>
                            <h2>{{ item.item_amount }} {{ item.item_amount === 1 ? "item" : "items" }}</h2>
                            <p>{{ item.transactionDate }}</p>
                        </ion-label>
                        <ion-label slot="end">
                            <h1>{{item.total_point}}</h1>
                        </ion-label>
                    </ion-item>
                </ion-list>

            </div>

        </ion-content>
    </ion-page>

</template>

<script setup lang="ts">
import {
    IonPage,
    IonContent,
    IonItem,
    IonList,
    IonLabel,
    IonText,
    onIonViewWillEnter,
    IonBackButton
} from "@ionic/vue"


import { convertTZ } from "@/utils/convertDateStringTimezone";
import { storeToRefs } from 'pinia';
import { requestWithToken } from "@/helpers/tokenedRequestWrapper";
import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";

interface TransactionData {
    transactionID: number,
    transactionDate: string,
    userID: number,
    username: string,
    rvmID: number,
    item_amount: number,
    total_point: number
}

const historyItems = ref<Array<TransactionData>>([]);
const totalItemCount = ref(0);
const pageCount = ref(0);
const authStore = useAuthStore();
const { userid } = storeToRefs(authStore);

onIonViewWillEnter(async () => {
    try {
        const historyData = await requestWithToken(
            "get",
            `${import.meta.env.VITE_GOCIRCULAR_API_URL}/transaction/list?userid=${userid.value}&page=1&size=500`,
        );

        console.log(historyData);

        const historyItemsRaw = historyData?.data.items;
        historyItemsRaw.forEach((data: TransactionData) => {
            data.transactionDate = convertTZ(data.transactionDate, "Asia/Jakarta");
        })
        
        totalItemCount.value = historyData?.data.totalItemCount;
        pageCount.value = historyData?.data.pageCount;
        historyItems.value = historyItemsRaw;
    } catch (err) {
        console.log(err);
    }

})

</script>

<style scoped>
ion-list {

    padding-top: 2px;
    padding-left: 1px;
    padding-right: 10px;
    padding-bottom: 15px;

    margin-bottom: 45px;

    border-style: solid;
    border-width: 3px;
    border-color: #d1d1d1;
    border-radius: 10px;

    width: 90%;
    height: 70%;

    overflow-y: auto;
}

.transaction-id{
    font-weight: 600;
}

.transaction-div {
    display: flex;
    flex-direction: column;
    height: 95vh;
    justify-content: space-between;
    align-items: center;

    padding-top: 5%;
}

.title-with-back{
    width: 95%
}

.title-with-back ion-text{
    width: 100%;
    padding-bottom: 12px;
    padding-right: 5%;
}

.notice {
    width: 80vw;
    text-align: center;
}

.title-col {
    font-weight: 500;
}

.expand-button {
    width: 80vw;
}
.stats h3{
    margin: 5px;
}

.stats p{
    margin: 2px;
}


</style>