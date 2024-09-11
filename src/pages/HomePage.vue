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

            <ion-button expand="full">
                <h1>Scan</h1>
                <h2>Kode QR untuk menukar</h2>
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