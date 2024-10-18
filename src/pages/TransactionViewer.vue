<template>

    <ion-page>
        <ion-content>
            <div class="transaction-div">
                <ion-text>
                    <h1>Transaction Preview</h1>
                </ion-text>

                <ion-text class="rvm-id">
                    <h3>RVM ID</h3>
                    <h3>{{ rvmId }}</h3>
                </ion-text>

                <ion-list>
                    <ion-item v-for="item in items" v-bind:key="item.itemIndex">
                        <ion-img slot="start" :src="thumbnailSelector(item.itemMessage[0])"
                            class="item-thumb"></ion-img>
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

                <ion-text class="notice">
                    <p>Press the "finish" button on the RVM to finish current transaction</p>
                </ion-text>
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
    IonText
} from "@ionic/vue"

import {
    watch
} from "vue";

// const imgSource = ref("/mobile/src/assets/transparent_bottle_minified.png");
import { useTransactionStore } from '@/stores/useTransactionStore';
import { storeToRefs } from 'pinia';
import { TransactionProgressState } from "@/types/transaction";
import { useRouter } from "vue-router";

const transactionStore = useTransactionStore();
const router = useRouter();

const { items, rvmId, pointsEarned, progressState } = storeToRefs(transactionStore);

watch(
    progressState,
    (state) => {
        console.log(state);
        console.log(Number(state));

        if (state !== TransactionProgressState.Inactive) {
            if (state === TransactionProgressState.Completed) {
                console.log("Transaction Finished");
                router.replace("/transaction-recap");
            }
        }
    }
)

function thumbnailSelector(itemEnumerator: number): string {
    switch (itemEnumerator) {
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
</script>

<style scoped>
ion-list {
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

.item-thumb {
    height: 50px;
}

.transaction-div {
    display: flex;
    flex-direction: column;
    height: 95vh;
    justify-content: flex-start;
    align-items: center;

    padding-top: 50px;
}

.rvm-id {
    margin-top: 20px;
    display: flex;
    width: 80vw;
    justify-content: space-between;
}

.notice {
    width: 80vw;
    text-align: center;
}
</style>
