<template>
    <ion-page>
        <ion-content>
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

            <ion-button expand="full" router-link="/qr-code-scan">
                <h1>Scan</h1>
                <h2>A QR Code</h2>
                <h2>To Begin</h2>
            </ion-button>

            <ion-button expand="full">
                Tukar Poin
            </ion-button>
            
            <ion-button expand="full">
                Lihat riwayat transaksi
            </ion-button>

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