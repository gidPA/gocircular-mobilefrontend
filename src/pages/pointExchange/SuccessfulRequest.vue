<template>
    <ion-page>
        <ion-content>
            <div class="fail-layout">
                <div class="title-with-back">
                    <ion-item  lines="none">
                        <ion-back-button default-href="/point_exchange" slot="start"></ion-back-button>
                    </ion-item>
                    <ion-text class="ion-text-center">
                        <h2>Exchange Request Submitted Successfully</h2>
                    </ion-text>
                </div>

                <ion-text class="ion-text-center">
                    <h6>Exchange Code</h6>
                    <h1>
                        {{queryId}}
                    </h1>
                </ion-text>
                
                <ion-text class="ion-text-center">
                    <p>Show this code to your nearest GoCircular outlet.</p>
                </ion-text>

                <ion-text class="ion-text-center">
                    <p>
                        You can access this page again later at <br>
                        <span style="font-weight: 500;">Home -> Exchange Points</span>
                    </p>
                </ion-text>

                <ion-button expand="full" @click="cancelRequest" style="width: 90%">
                    Cancel Request
                </ion-button>

                <ion-button expand="full" @click="backToHome" style="width: 90%">
                    Back to Home Page
                </ion-button>
            </div>


        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonButton,
    IonPage,
    IonContent,
    IonText,
    IonBackButton,
    IonItem,

} from "@ionic/vue";
import { computed, } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { apiRequest, ApiRequestMethods } from "@/utils/http";



const route = useRoute();
const router = useRouter();

// Define the computed property and handle potential types (array, string, null)
const queryId = computed(() => {
    const exchangeid = route.query.exchangeid;
    return Array.isArray(exchangeid) ? exchangeid[0] : exchangeid; // Handle array case, return first element
});

const cancelRequest = async () => {
    try{
        apiRequest(
            '/point_exchange/cancel',
            ApiRequestMethods.PUT,
            {
                data: {
                    exchangeID: queryId.value
                }
            }
        )
        router.replace("/point_exchange");
    }
    catch(err){
        console.log(err);
    }

}


const backToHome = () => {
    router.replace("/point_exchange");
}

</script>

<style scoped>
.fail-layout {
    height: 90vh;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    padding-top: 40px;
    padding-left: 20px;
    padding-right: 20px;
}

/* .stick-bottom{
    margin-top: auto;
} */
.explanation-label {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.sadface {
    width: 30vh;
    max-width: 220px;
}
</style>