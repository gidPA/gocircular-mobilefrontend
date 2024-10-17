<template>
    <ion-page>
        <ion-content>
            <div class="homepage">
                <div>
                    <ion-text>
                        <h1>
                            Your current point
                        </h1>
                    </ion-text>
                    <ion-text>
                        <h1>
                            5000
                        </h1>
                    </ion-text>
                </div>


                <div class="homepage-buttons">
                    <ion-button expand="full" router-link="/qr-code-scan" class="scan-button">
                        <h1>Exchange <br> Recyclables</h1>
                    </ion-button>

                    <ion-button expand="full">
                        Exchange Points
                    </ion-button>

                    <ion-button expand="full">
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
} from '@ionic/vue'
</script>

<style scoped>
.homepage{
    display: flex;
    flex-direction: column;
    height: 95vh;
    justify-content: space-around;
    align-items: center;

    padding-top: 50px;
}

.homepage-buttons{
    width: 80vw;
}
</style>