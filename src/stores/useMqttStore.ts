// stores/mqtt.js
import { defineStore } from 'pinia';
// import { useAuthStore } from './useAuthStore';
import mqtt, { MqttClient, IClientOptions } from 'mqtt';

interface Message{
    topic: string;
    message: string;
}

export const useMqttStore = defineStore('mqtt', {
    state: () => ({
        client: null as null | MqttClient,
        rvmid: null as null | number,
        messages: [] as Array<Message>,
        isConnected: false as boolean,
    }),

    actions: {
        connectToBroker(brokerUrl: string, options: IClientOptions = {}) {
            if (this.client) {
                this.client.end(); // End any existing connection
            }

            // const clientOptions: IClientOptions = {
            //     username: this.getAccountDetails().userid.toString(),
            //     password: this.getAccountDetails().accessToken
            // }

            this.client = mqtt.connect(brokerUrl, options);

            this.client.on('connect', () => {
                this.isConnected = true;
                console.log('Connected to MQTT broker');
            });

            this.client.on('message', (topic, message) => {
                this.messages.push({
                    topic: topic,
                    message: message.toString()
                })
            });

            this.client.on('error', (error) => {
                console.error('MQTT Connection Error:', error);
            });

            this.client.on('close', () => {
                this.isConnected = false;
                console.log('Disconnected from MQTT broker');
            });
        },

        subscribeToTopic(topic: string) {
            if (this.client && this.isConnected) {
                this.client.subscribe(topic, (err) => {
                    if (err) {
                        console.error(`Failed to subscribe to ${topic}:`, err);
                    } else {
                        console.log(`Subscribed to ${topic}`);
                    }
                });
            }
        },

        publishMessage(topic: string, message: string) {
            if (this.client && this.isConnected) {
                this.client.publish(topic, message, (err) => {
                    if (err) {
                        console.error(`Failed to publish message:`, err);
                    }
                });
            }
        },

        disconnectFromBroker() {
            if (this.client && this.isConnected) {
                this.client.end();
                this.isConnected = false;
                console.log('Disconnected from MQTT broker');
            }
        },
    },
});