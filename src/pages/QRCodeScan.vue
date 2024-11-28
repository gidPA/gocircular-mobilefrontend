<template>
    <ion-page>
        <ion-content>
            <div class="base-layout">
                <ion-text class="ion-text-center">
                    <h1>Scan the QR Code Attached on the RVM to Begin</h1>
                </ion-text>
                <ion-text class="ion-text-center">
                    <p>Scanned RVM ID: {{ rvmID }}</p>
                    <p v-if="error">{{ error }}</p>
                </ion-text>
                <div class="qr-code-scanner" v-if="cameraIsActive">
                    <div class="camera-view">
                        <qrcode-stream @detect="onDetect" @error="onError">
                        </qrcode-stream>
                    </div>
                </div>
            </div>
        </ion-content>

    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonContent,
    IonText,
    onIonViewDidEnter,
    onIonViewDidLeave,

} from "@ionic/vue";

import {
    ref,
    watch
} from "vue";

import {
    QrcodeStream
} from "vue-qrcode-reader"

import { useTransactionStore } from "@/stores/useTransactionStore";
import { storeToRefs } from "pinia";
import { TransactionProgressState } from "@/types/transaction";
import { useRouter } from "vue-router";

const rvmID = ref<number>(0);
const error = ref('');
const cameraIsActive = ref<boolean>(false);
const router = useRouter();
const transactionStore = useTransactionStore();
const { progressState } = storeToRefs(transactionStore);

function onError(err: Error) {
    error.value = `[${err.name}]: `

    if (err.name === 'NotAllowedError') {
        error.value += 'you need to grant camera access permission'
    } else if (err.name === 'NotFoundError') {
        error.value += 'no camera on this device'
    } else if (err.name === 'NotSupportedError') {
        error.value += 'secure context required (HTTPS, localhost)'
    } else if (err.name === 'NotReadableError') {
        error.value += 'is the camera already in use?'
    } else if (err.name === 'OverconstrainedError') {
        error.value += 'installed cameras are not suitable'
    } else if (err.name === 'StreamApiNotSupportedError') {
        error.value += 'Stream API is not supported in this browser'
    } else if (err.name === 'InsecureContextError') {
        error.value += 'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
    } else {
        error.value += err.message
    }
}

onIonViewDidEnter(() => {
    console.log("Entered QR Code view");
    cameraIsActive.value = true;
});

onIonViewDidLeave(() => {
    console.log("Exiting QR Code view");
    cameraIsActive.value = false;
});

// I know I should not use 'any' type, but I couldn't find any type specification from 
// the docs
// It is said that the type used is Array<DetectedBarcode>, but I can't find
// any export of the type in the code

function onDetect(detectedCodes: Array<any>) {
    // result.value = JSON.stringify(
    //     detectedCodes.map(code => code.rawValue)
    // );
    performance.mark('rvmPairingStart');
    rvmID.value = JSON.parse(detectedCodes[0].rawValue).rvmid;

}

watch(
    rvmID,
    (rvmId) => {
        if (rvmId > 4000) {
            transactionStore.initializeTransaction(rvmId);
        }
    }
);

watch(
    progressState,
    (state) => {
        console.log(state);
        console.log(Number(state));

        if (state !== TransactionProgressState.Inactive) {
            if (state === TransactionProgressState.Approved) {
                console.log("Can proceed");
                router.replace({
                    name: 'Transaction Viewer'
                });
            } else {
                router.replace({
                    name: 'Fail View',
                    query: {
                        failid: (Number(state)).toString()
                    }
                });
            }
        }
    }
)

</script>

<style scoped>
.qr-code-scanner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
    width: 100vw;

}

.camera-view {
    width: 70vw;
    height: 70vw;
    max-width: 400px;
    max-height: 400px;
}
</style>