<template>
    <ion-page>
        <ion-content>
        <div class="transaction-div">
            <ion-text>
                <h1>Transaction Completed</h1>
            </ion-text>

            <ion-grid>
                <ion-row>
                    <ion-col size="4" class="title-col">RVM ID</ion-col>
                    <ion-col size="1"></ion-col>
                    <ion-col size="5" class="ion-text-right">{{ rvmId }}</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="4" class="title-col">Transaction Date</ion-col>
                    <ion-col size="1"></ion-col>
                    <ion-col size="5" class="ion-text-right">{{ formattedDate }}</ion-col>
                </ion-row>
            </ion-grid>

            <ion-list>
                <ion-item v-for="item in items" v-bind:key="item.itemIndex">
                    <ion-img slot="start" :src="thumbnailSelector(item.itemMessage[0])" class="item-thumb"></ion-img>
                    <ion-label>
                        <h2>{{ item.itemType }}</h2>
                        <p>{{ item.itemSize }}</p>
                    </ion-label>
                    <ion-label slot="end">
                        <h1>{{ item.itemPrice ? item.itemPrice : "..." }}</h1>
                    </ion-label>
                </ion-item>
            </ion-list>

            <ion-text class="rvm-id">
                <h3>Total</h3>
                <h3>{{ pointsEarned }} <span>{{ pointsEarned == 1 ? "point" : "points" }}</span></h3>
            </ion-text>

            <div class="expand-button">
                <ion-button expand="full" v-on:click="homepageButton">Back to Homepage</ion-button>
            </div>

        </div>

    </ion-content>
    </ion-page>

</template>

<script setup lang="ts">
import {
    IonPage,
    IonContent,
    IonImg,
    IonItem,
    IonList,
    IonLabel,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonButton
} from "@ionic/vue"


import { useTransactionStore } from '@/stores/useTransactionStore';
import { storeToRefs } from 'pinia';
import { computed } from "vue";
import { useRouter } from "vue-router";

const transactionStore = useTransactionStore();
const router = useRouter();

const formattedDate = computed(() => {
    const date = transactionDate.value;
    const options:Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Ensure this is false for 24-hour format
    };
    if (date){
        const dateString = date.toLocaleString('en-GB', options);
        return dateString;
    } else{
        return null;
    }

});

const { items, 
        rvmId, 
        pointsEarned,
        transactionDate
    } = storeToRefs(transactionStore);

function thumbnailSelector(itemEnumerator:number):string{
    switch(itemEnumerator){
        case 1:
            return "/mobile/src/assets/transparent_bottle_minified.png";
        case 2:
            return "/mobile/src/assets/transparent_bottle_minified.png";
        case 3:
            return "/mobile/src/assets/soda_can_minified.png";
        default:
            return "/mobile/src/assets/transparent_bottle_minified.png";
    }
}

async function homepageButton(){
    await router.replace({
        name: "Homepage"
    })

    transactionStore.endTransaction();
}
</script>

<style scoped>
ion-list {

    padding-top: 2px;
    padding-left: 1px;
    padding-right: 10px;
    padding-bottom: 15px;

    border-style: solid;
    border-width: 3px;
    border-color: #d1d1d1;
    border-radius: 10px;

    width: 90vw;
    height: 40vh;

    overflow-y: auto;
}

.item-thumb {
    height: 50px;
}

.transaction-div {
    display: flex;
    flex-direction: column;
    height: 95vh;
    justify-content: space-between;
    align-items: center;

    padding-top: 40px;
}

.rvm-id {
    
    display: flex;
    width: 80vw;
    justify-content: space-between;
}

.notice {
    width: 80vw;
    text-align: center;
}

ion-grid {
    padding-top: 15px;
    width: 80vw;
    --ion-grid-columns: 10;
    flex: 0;
}

.title-col {
    font-weight: 500;
}

.expand-button{
    width: 80vw;
}
</style>
