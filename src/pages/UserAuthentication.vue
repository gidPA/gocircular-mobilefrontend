<template>
    <ion-page>
        <ion-content>
            <ion-text class="ion-text-center">
                <h1>GoCircular Companion App</h1>
            </ion-text>

            <form>
                <ion-list>
                    <ion-item>
                        <ion-input label="Email Address" label-placement="floating" type="email" required></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-input label="Password" label-placement="floating" type="password" required></ion-input>
                    </ion-item>
                </ion-list>
            </form>
            <ion-button type="submit" expand="full">Login</ion-button>

        </ion-content>
    </ion-page>

</template>

<script lang="ts">
import {
    IonPage,
    IonText,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonButton,
} from '@ionic/vue'
    
export default {
    components: {
        IonPage,
        IonText,
        IonContent,
        IonList,
        IonItem,
        IonInput,
        IonButton
    },
    data(){
        return{
            enteredEmailAddress: "",
            enteredPassword: ""
        }
    },

    methods:{
        submitCredentials(){
            
        }
    }
}
</script>