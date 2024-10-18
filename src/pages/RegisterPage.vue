<template>
    <ion-page>
        <ion-content>
            <div class="base-layout">
                <ion-text class="ion-text-center">
                    <h1>Register</h1>
                </ion-text>

                <div class="login-form">
                    <ion-list>
                        <ion-item>
                            <ion-input label="Username" label-placement="floating" type="text" v-model="form.username"
                                required>
                            </ion-input>
                        </ion-item>
                        <ion-note class="validation-error" color="danger" v-if="errors.username">{{ errors.username
                            }}</ion-note>
                        <ion-item>
                            <ion-input label="Email Address" label-placement="floating" type="email"
                                v-model="form.email" required>
                            </ion-input>
                        </ion-item>
                        <ion-note class="validation-error" color="danger" v-if="errors.email">{{ errors.email
                            }}</ion-note>
                        <ion-item>
                            <ion-input label="Password" label-placement="floating" type="password"
                                v-model="form.password" required></ion-input>
                        </ion-item>
                        <ion-note class="validation-error" color="danger" v-if="errors.password">{{ errors.password
                            }}</ion-note>
                        <ion-item>
                            <ion-input label="Confirm Password" label-placement="floating" type="password"
                                v-model="form.confirmedPassword" required></ion-input>
                        </ion-item>
                        <ion-note class="validation-error" color="danger" v-if="errors.confirmedPassword">{{
                            errors.confirmedPassword }}</ion-note>
                    </ion-list>

                    <div class="warning-message">
                        <ion-text v-if="serverErrorMessage" class="ion-text-center" color="danger">
                            <p>{{ serverErrorMessage }}</p>
                        </ion-text>

                    </div>

                    <ion-button expand="full" @click="submitRegistrationForm">Register</ion-button>

                </div>



            </div>


        </ion-content>
    </ion-page>

</template>

<script setup lang="ts">
import { z } from "zod";
import {
    IonPage,
    IonNote,
    IonText,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonButton,
} from '@ionic/vue'
import { ref, reactive } from 'vue';
import { useRouter } from "vue-router";
import axios, { AxiosError } from "axios";


const router = useRouter();
const serverErrorMessage = ref("");

const errors = reactive<Record<string, string | undefined>>({});
const form = reactive({
    email: '',
    username: '',
    password: '',
    confirmedPassword: '',
});

const requestSchema = z
    .object({
        email: z.string().email(),
        username: z.string().min(4, { message: "Username must be at least 4 characters" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        confirmedPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmedPassword, {
        message: "Passwords do not match",
        path: ['confirmedPassword'], // This points the error to the confirmedPassword field
    });


//login method
const submitRegistrationForm = async () => {
    try {
        console.log("Submitting Registration Form...");
        serverErrorMessage.value = "";

        Object.keys(errors).forEach((key) => (errors[key] = undefined));
        // Example usage
        const result = requestSchema.safeParse(form);

        if (!result.success) {
            // Map Zod errors to the `errors` object for display
            const formattedErrors = result.error.format();
            // Iterate over the formatted errors and handle type variations
            Object.entries(formattedErrors).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    // Handle plain array case
                    errors[key] = value[0];
                } else if (value && '_errors' in value) {
                    // Handle the nested object with _errors array
                    errors[key] = value._errors[0];
                }
            });
        } else {
            console.log(result.data);
            const response = await axios.post(
                `${import.meta.env.VITE_GOCIRCULAR_API_URL}/user/register`,
                result.data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )

            if (response.status === 201) {
                router.replace("/register-success")
            }
        }
    } catch (err) {
        console.log(err);
        if (err instanceof AxiosError) {
            if (err.response) {
                serverErrorMessage.value = err.response.data.details[0].message
            }
        }
    }

}
</script>

<style scoped>
.logo {
    width: 30vh;
    height: 30vh;
}

.warning-message {
    height: 60px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.warning-message p {
    margin: 6px;
    font-size: 10pt;
}

.validation-error {
    padding-left: 16px;
}
</style>