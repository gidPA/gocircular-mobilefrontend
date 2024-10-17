<template>
<ion-content>
    <div class="transaction-div">
        <ion-text>
            <h1>Transaction Preview</h1>
        </ion-text>

        <ion-text class="rvm-id">
            <h3>RVM ID</h3>
            <h3>4001</h3>
        </ion-text>
        
        <ion-list>
            <ion-item>
                <ion-img slot="start" :src=imgSource class="item-thumb"></ion-img>
                <ion-label>
                    <h2>Plastic Bottle - Transparent</h2>
                    <p>Large</p>
                </ion-label>
                <ion-label slot="end">
                    <h1>100</h1>
                </ion-label>
            </ion-item>
            <ion-item>
                <ion-img slot="start" :src=imgSource class="item-thumb"></ion-img>
                <ion-label>
                    <h2>Plastic Bottle - Transparent</h2>
                    <p>Large</p>
                </ion-label>
                <ion-label slot="end">
                    <h1>100</h1>
                </ion-label>
            </ion-item>

            <ion-item>
                <ion-img slot="start" :src=imgSource class="item-thumb"></ion-img>
                <ion-label>
                    <h2>Plastic Bottle - Transparent</h2>
                    <p>Large</p>
                </ion-label>
                <ion-label slot="end">
                    <h1>100</h1>
                </ion-label>
            </ion-item>

            <ion-item>
                <ion-img slot="start" :src=imgSource class="item-thumb"></ion-img>
                <ion-label>
                    <h2>Plastic Bottle - Transparent</h2>
                    <p>Large</p>
                </ion-label>
                <ion-label slot="end">
                    <h1>100</h1>
                </ion-label>
            </ion-item>

            <ion-item>
                <ion-img slot="start" :src=imgSource class="item-thumb"></ion-img>
                <ion-label>
                    <h2>Plastic Bottle - Transparent</h2>
                    <p>Large</p>
                </ion-label>
                <ion-label slot="end">
                    <h1>100</h1>
                </ion-label>
            </ion-item>
        </ion-list>

        <ion-text class="rvm-id">
            <h3>Total</h3>
            <h3>100 <span>points</span></h3>
        </ion-text>

        <ion-text class="notice">
            <p>Press the "finish" button on the RVM to finish current transaction</p>
        </ion-text>
    </div>

</ion-content>
</template>

<script setup lang="ts">
import {
IonContent,
IonImg,
IonItem,
IonList,
IonLabel,
IonText
} from "@ionic/vue"

import {
    ref
} from "vue";

const imgSource = ref("/mobile/src/assets/transparent_bottle_minified.png");
// import { useTransactionStore } from '@/stores/useTransactionStore';
// import { storeToRefs } from 'pinia';

// const transactionStore = useTransactionStore();

// const { items, itemIndex } = storeToRefs(transactionStore);
</script>

<style scoped>
ion-list{
    margin-top: 30px;

    padding-top: 2px;
    padding-left: 1px;
    padding-right: 10px;
    padding-bottom: 15px;

    border-style: solid;
    border-width: 3px;
    border-color: #d1d1d1;
    border-radius: 10px;

    width: 90vw;
    height: 55vh;

    overflow-y: auto;
}

.item-thumb{
    height: 50px;
}

.transaction-div{
    display: flex;
    flex-direction: column;
    height: 95vh;
    justify-content: flex-start;
    align-items: center;

    padding-top: 50px;
}

.rvm-id{
    margin-top: 20px;
    display: flex;
    width: 80vw;
    justify-content: space-between;
}

.notice{
    width: 80vw;
    text-align: center;
}
</style>
