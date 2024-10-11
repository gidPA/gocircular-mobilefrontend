import { defineStore } from "pinia";
import { useMQTT } from "mqtt-vue-hook";
import {
    ItemType,
    ItemSize,
    type RecyclableItem,
    type RecyclableEntryMessage
} from "@/types/recyclable";

import {
    TransactionProgressState
} from "@/types/transaction"

const mqttHook = useMQTT();

interface TransactionState{
    rvmId: null | number;
    isConnected: boolean;
    progressState: TransactionProgressState;
    items: Array<RecyclableItem>;
    itemIndex: number;

    topicSubscription: Array<string>
}



export const useTransactionStore = defineStore('transaction', 
{
    state: (): TransactionState => ({
        rvmId: null,
        isConnected: false,
        progressState: TransactionProgressState.Inactive,
        items: [],
        itemIndex: 0,

        topicSubscription: [],
    }),
    getters: {
        
    }
    ,
    actions: {
        async initializeTransaction(rvmId: number){
            // const mqttHost = import.meta.env.VITE_GOCIRCULAR_MQTT_BROKER;

            try{
                if(!mqttHook.isConnected()){
                    this.topicSubscription.push(`gocircular/rvm/${rvmId}/output/member_mode_ack`);
                    this.topicSubscription.push(`gocircular/rvm/${rvmId}/output/pending_item`);
                    this.topicSubscription.push(`gocircular/rvm/${rvmId}/output/entered_item`);

                    console.log(this.topicSubscription);

                    await mqttHook.registerEvent(
                        'on-connect',
                        () => {
                            // mqttHook.subscribe([`gocircular/rvm/${rvmId}/output/member_mode_ack`], 0);
                            // mqttHook.subscribe([`gocircular/rvm/${rvmId}/output/pending_item`], 0);
                            // mqttHook.subscribe([`gocircular/rvm/${rvmId}/output/entered_item`], 0);

                            mqttHook.subscribe(this.topicSubscription, 0);

                            this.isConnected = true;
                        }
                    );

                    await mqttHook.connect(
                        import.meta.env.VITE_GOCIRCULAR_MQTT_BROKER,
                        {
                            clean: false,
                            keepalive: 60,
                            clientId: import.meta.env.VITE_GOCIRCULAR_MQTT_ID,
                            username: import.meta.env.VITE_GOCIRCULAR_MQTT_ID,
                            password: import.meta.env.VITE_GOCIRCULAR_MQTT_PASSWORD,
                            path: "/mqtt",
                            connectTimeout: 4000
                        }
                    );

                    const timeoutTimer = setTimeout(
                        () => {
                            this.progressState = TransactionProgressState.TimeoutError;
                        },
                        10000
                    )

                    await mqttHook.registerEvent(
                        `gocircular/rvm/${rvmId}/output/member_mode_ack`,
                        (topic: string, message: string) => {
                            console.log(`Received approval message ${message}`);
                            this.progressState = Number(message.toString());
                            clearTimeout(timeoutTimer);
                        },
                    );

                    await mqttHook.registerEvent(
                        `gocircular/rvm/${rvmId}/output/pending_item`,
                        (topic: string, message: string) => {
                            const messageObj: RecyclableEntryMessage
                                = JSON.parse(message.toString());
                            const newItem: RecyclableItem = {
                                itemType: ItemType[messageObj.enteredItem[0]],
                                itemSize: ItemSize[messageObj.enteredItem[1]],
                                itemPrice: null
                            };
                            this.items[this.itemIndex] = newItem;
                        }
                    );

                    await mqttHook.registerEvent(
                        `gocircular/rvm/${rvmId}/output/entered_item`,
                        (topic: string, message: string) => {
                            const messageObj: RecyclableEntryMessage = JSON.parse(message.toString());
                            const newItem: RecyclableItem = {
                                itemType: ItemType[messageObj.enteredItem[0]],
                                itemSize: ItemSize[messageObj.enteredItem[1]],
                                itemPrice: messageObj.enteredItem[2],
                            };

                            //Enter current items with the price
                            this.items[this.itemIndex] = newItem;
                            
                            //Increment item Index so that next item enters in the next index
                            this.itemIndex += 1;
                        }
                    );

                    await mqttHook.registerEvent(
                        `gocircular/rvm/${rvmId}/output/transaction_report`,
                        (topic: string, message: string) => {     
                            this.progressState = TransactionProgressState.Completed;
                            
                            const messageObj: RecyclableEntryMessage
                                = JSON.parse(message.toString());
                            const newItem: RecyclableItem = {
                                itemType: ItemType[messageObj.enteredItem[0]],
                                itemSize: ItemSize[messageObj.enteredItem[1]],
                                itemPrice: null
                            };
                            this.items[this.itemIndex] = newItem;
                        }
                    );


                    console.log("Publishing Approval message");



                    await mqttHook.publish(
                        `gocircular/rvm/${rvmId}/input/member_mode_req`,
                        "1",
                        0
                    );


                }
            } catch(err) {
                console.log(err);

            }


        },
        
        async endTransaction(){
            if(mqttHook.isConnected()){
                this.topicSubscription.forEach(
                    async (topic) => {
                        await mqttHook.unSubscribe(topic, () => {
                            console.log(`unsubscribed from topic: ${topic}`);
                        });
                    }
                );
            }
        },

        async completeTransaction(){
            await this.endTransaction();
            this.progressState = TransactionProgressState.Completed;
        },

        async abortTransaction(){
            await this.endTransaction();
        }
    }
});