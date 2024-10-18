import { defineStore } from "pinia";
import { useMQTT } from "mqtt-vue-hook";
import { useAuthStore } from "./useAuthStore";
import {
    ItemType,
    ItemSize,
    type RecyclableItem,
    type RecyclableEntryMessage,
    TransactionReportMessage
} from "@/types/recyclable";

import {
    TransactionProgressState
} from "@/types/transaction"

const mqttHook = useMQTT();

interface TransactionState {
    rvmId: null | number;
    isConnected: boolean;
    progressState: TransactionProgressState;
    items: Array<RecyclableItem>;
    itemIndex: number,
    transactionDate: Date | null,
    // pointsEarned: number;

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
            transactionDate: null,
            // pointsEarned: 0,

            topicSubscription: [],
        }),

        getters: {
            pointsEarned:
                (state) => state.items.map(item => item.itemPrice)
                    .reduce((acc, val) => acc + val, 0),
        },

        actions: {
            async initializeTransaction(rvmId: number) {
                // const mqttHost = import.meta.env.VITE_GOCIRCULAR_MQTT_BROKER;

                const authStore = useAuthStore();

                try {
                    if (!mqttHook.isConnected()) {
                        this.topicSubscription.push(`gocircular/rvm/${rvmId}/output/member_mode_ack`);
                        this.topicSubscription.push(`gocircular/rvm/${rvmId}/output/pending_item`);
                        this.topicSubscription.push(`gocircular/rvm/${rvmId}/output/entered_item`);
                        this.topicSubscription.push(`gocircular/rvm/${rvmId}/output/rejected_item`);
                        this.topicSubscription.push(`gocircular/rvm/${rvmId}/output/transaction_report`);

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
                        if (authStore.userid && authStore.accessToken) {
                            await mqttHook.connect(

                                import.meta.env.VITE_GOCIRCULAR_MQTT_BROKER,
                                {
                                    clean: false,
                                    keepalive: 60,
                                    clientId: authStore.userid.toString(),
                                    username: authStore.userid.toString(),
                                    password: authStore.accessToken,
                                    path: "/mqtt",
                                    connectTimeout: 4000
                                }
                            );
                        } else {
                            throw new Error("Cannot connect to MQTT Broker: User not authenticated");
                        }


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

                                console.log(messageObj);
                                const newItem: RecyclableItem = {
                                    itemMessage: messageObj.enteredItem,
                                    itemIndex: this.itemIndex,
                                    itemType: ItemType[messageObj.enteredItem[0]],
                                    itemSize: ItemSize[messageObj.enteredItem[1]],
                                    itemPrice: 0
                                };
                                this.items[this.itemIndex] = newItem;
                                console.log(this.items);
                            }
                        );

                        await mqttHook.registerEvent(
                            `gocircular/rvm/${rvmId}/output/rejected_item`,
                            (topic: string, message: string) => {
                                console.log("An item has been rejected")
                                this.items.splice(this.itemIndex, 1);
                                console.log(this.items);
                            }
                        );

                        await mqttHook.registerEvent(
                            `gocircular/rvm/${rvmId}/output/entered_item`,
                            (topic: string, message: string) => {
                                console.log("new entered item confirmed");
                                const messageObj: RecyclableEntryMessage = JSON.parse(message.toString());
                                const newItem: RecyclableItem = {
                                    itemMessage: messageObj.enteredItem,
                                    itemIndex: this.itemIndex,
                                    itemType: ItemType[messageObj.enteredItem[0]],
                                    itemSize: ItemSize[messageObj.enteredItem[1]],
                                    itemPrice: messageObj.enteredItem[2]
                                };

                                //Enter current items with the price
                                this.items[this.itemIndex] = newItem;

                                //Increment item Index so that next item enters in the next index
                                this.itemIndex += 1;

                                // if(newItem.itemPrice){
                                //     this.pointsEarned += newItem.itemPrice;
                                // }

                            }
                        );

                        await mqttHook.registerEvent(
                            `gocircular/rvm/${rvmId}/output/transaction_report`,
                            (topic: string, message: string) => {
                                console.log("Transaction Completed");
                                const messageObj: TransactionReportMessage
                                    = JSON.parse(message.toString());

                                const itemsData = messageObj.recyclableItems;
                                const provisionalItems: Array<RecyclableItem> = [];

                                this.transactionDate = new Date(messageObj.transactionDate);
                                
                                if (isNaN(this.transactionDate.getTime())) {
                                    console.log(`Issued date is invalid, with the value ${this.transactionDate}`)
                                }

                                for (let i = 0; i < itemsData.length; i++) {
                                    provisionalItems[i] = {
                                        itemIndex: i,
                                        itemType: ItemType[itemsData[i][0]],
                                        itemSize: ItemSize[itemsData[i][1]],
                                        itemPrice: itemsData[i][2],
                                        itemMessage: itemsData[i],

                                    }
                                }

                                this.items = provisionalItems;
                                this.progressState = TransactionProgressState.Completed;

                            }
                        );


                        console.log("Publishing Approval message");



                        await mqttHook.publish(
                            `gocircular/rvm/${rvmId}/input/member_mode_req`,
                            authStore.userid.toString(),
                            0
                        );

                        this.rvmId = rvmId;


                    }
                } catch (err) {
                    console.log(err);

                }


            },

            async endTransaction() {
                if (mqttHook.isConnected()) {
                    this.topicSubscription.forEach(
                        async (topic) => {
                            await mqttHook.unSubscribe(topic, () => {
                                console.log(`unsubscribed from topic: ${topic}`);
                            });
                        }
                    );
                    mqttHook.disconnect();
                    Object.assign(this, this.$reset());
                }

            },

            async abortTransaction() {
                await this.endTransaction();
            }
        }
    });