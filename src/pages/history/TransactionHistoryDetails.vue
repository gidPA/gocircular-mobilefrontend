<template>
    <ion-page>
        <ion-content>

            <div class="transaction-div">
                <ion-item class="title-with-back" lines="none">
                    <ion-back-button default-href="/" slot="start"></ion-back-button>
                    <ion-text class="ion-text-center">
                        <h1>Transaction Details</h1>
                    </ion-text>
                </ion-item>

                <ion-grid>
                    <ion-row>
                        <ion-col size="4" class="title-col">Transaction ID</ion-col>
                        <ion-col size="1"></ion-col>
                        <ion-col size="5" class="ion-text-right">{{ transactionID }}</ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col size="4" class="title-col">RVM ID</ion-col>
                        <ion-col size="1"></ion-col>
                        <ion-col size="5" class="ion-text-right">{{ transactionDetail?.rvmID }}</ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col size="4" class="title-col">Transaction Date</ion-col>
                        <ion-col size="1"></ion-col>
                        <ion-col size="5" class="ion-text-right">{{ transactionDetail?.transactionDate }}</ion-col>
                    </ion-row>
                </ion-grid>

                <ion-list>
                    <ion-item v-for="item in recyclableItems" v-bind:key="item.itemid">
                        <ion-img slot="start" :src="thumbnailSelector(item.item_material)"
                            class="item-thumb"></ion-img>
                        <ion-label>
                            <h2>{{ typeNames(item.item_material) }}</h2>
                            <p class="type-name">{{ item.item_size.toLowerCase() }}</p>
                        </ion-label>
                        <ion-label slot="end">
                            <h1>{{ item.point }}</h1>
                        </ion-label>
                    </ion-item>
                </ion-list>
                <div class="stats">
                    <ion-text class="rvm-id">
                        <h3>Total</h3>
                        <h3>{{ transactionDetail?.transaction_point }} <span>{{ transactionDetail?.transaction_point == 1 ? "point" : "points" }}</span></h3>
                    </ion-text>
                </div>

            </div>

        </ion-content>
    </ion-page>

</template>

<script setup lang="ts">
import { requestWithToken } from "@/helpers/tokenedRequestWrapper";
import { ThumbnailLink } from "@/types/recyclable";
import { convertTZ } from "@/utils/convertDateStringTimezone";
import { useRoute } from "vue-router";
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
    onIonViewWillEnter,
    IonBackButton
} from "@ionic/vue"
import { ref } from "vue";

interface RecyclableDetail{
    itemid: number;
    point: number;
    item_material: string;
    item_size: string;
}
interface TransactionDetail{
    transactionID: number;
    transactionDate: string;
    userID: number;
    rvmID: number;
    username: string;
    recyclableDetails: Array<any>
    transaction_point: number
}

const route = useRoute();
const transactionID = route.params.id;

const recyclableItems = ref<Array<RecyclableDetail>>([]);
const transactionDetail = ref<TransactionDetail | null>(null);

function thumbnailSelector(itemTag: string): string {
    switch (itemTag) {
        case "PLASTIC_COLORED":
            return ThumbnailLink[2];
        case "PLASTIC_TRANSPARENT":
            return ThumbnailLink[1];
        case "METAL":
            return ThumbnailLink[3];
        default:
            return "/mobile/src/assets/transparent_bottle_minified.png";
    }
}

function typeNames(itemTag: string): string {
    switch (itemTag) {
        case "PLASTIC_COLORED":
            return "Plastic - Colored";
        case "PLASTIC_TRANSPARENT":
            return "Plastic - Transparent";
        case "METAL":
            return "Metal Can";
        default:
            return "Type Unknown";
    }
}

onIonViewWillEnter(async () => {
    try{
        if (!transactionID){
            throw new Error("Transaction ID not specified");
        }

        console.log(transactionID)

        const response = await requestWithToken(
            "get",
            `${import.meta.env.VITE_GOCIRCULAR_API_URL}/transaction/view/${transactionID}`
        );

        console.log(response?.data);

        transactionDetail.value = response?.data;
        transactionDetail.value.transactionDate = convertTZ(response?.data.transactionDate, "Asia/Jakarta");

        recyclableItems.value = response?.data.recyclableDetails;

    }catch (err){
        console.log(err);
    }


});


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

    width: 90%;
    height: 60%;

    overflow-y: auto;
}

ion-img{
    width: 40px;
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

    padding-top: 5%;
}

.rvm-id {

    display: flex;
    width: 80vw;
    justify-content: space-between;
    align-items: center;
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

.expand-button {
    width: 80vw;
}

.stats{
    margin-top: 30px;
    margin-bottom: 10px;
}
.stats h3{
    margin: 5px;
}

.type-name{
    text-transform: capitalize;
}

.title-with-back{
    width: 95%
}

.title-with-back {
    width: 98%
}

.title-with-back ion-text{
    width: 100%;
    padding-bottom: 12px;
    padding-right: 5%;
}


</style>
