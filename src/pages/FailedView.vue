<template>
    <ion-page>
        <ion-content>
            <div class="fail-layout">

                <ion-img :src="imgDir" class="sadface">

                </ion-img>
                <div class="explanation-label"> 
                    <h1>
                    Unable to begin transaction
                </h1>
                <p>{{ failureReason }}</p>

                </div>




                <ion-button expand="full" class="stick-bottom">
                    Back to Home Page
                </ion-button>
            </div>


        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import{
    IonButton,
    IonPage,
    IonContent,
    IonImg,

} from "@ionic/vue";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";


const route = useRoute();

const imgDir = ref("/mobile/src/assets/sadface.png");

// Define the computed property and handle potential types (array, string, null)
const queryId = computed(() => {
    const failId = route.query.failid;
    return Array.isArray(failId) ? failId[0] : failId; // Handle array case, return first element
});

// Computed property that works with the queryId
const failureReason = computed(() => {
    const failureId = queryId.value;
    switch(failureId){
        case "125":
            return "The requested RVM is currently out of order";
        case "126":
            return "The requested RVM is currently out of order";
        case "127":
            return "The requested RVM is currently busy";
        case "400":
            return "Cannot establish connection with the requested RVM";
        default:
            return "Cause cannot be determined. If possible, please report this to our maintainer";
    }
});

</script>

<style scoped>
.fail-layout{
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
.explanation-label{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.sadface{
    width: 30vh;
    max-width: 220px;
}
</style>