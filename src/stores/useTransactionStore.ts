import { defineStore } from "pinia";
import { useMqttStore } from "./useMqttStore";
import { RecyclableItem, ItemSize, ItemType } from "@/types/recyclable";
import {watch} from "vue";

interface PendingItemMessage{
    pendingItem: Array<number>;
}

interface ItemEntryMessage{
    enteredItem: Array<number>;
}


export const useTransactionStore = defineStore("transaction", {
    state: () => ({
        rvmid: null as null | number,
        items: [] as Array<RecyclableItem>,
        itemIndex: 0 as number,
        completed: false as boolean,
    }),
    actions: {
        setupRecyclableWatcher(){
            const mqttStore = useMqttStore();
            
            watch(
                () => mqttStore.messages,
                (updatedMessages) => {
                    const newestMessage = updatedMessages.splice(0,0)[1];
                    if(newestMessage.topic === `gocircular/rvm/${this.rvmid}/output/transaction/pendingItem`){
                        const itemObj: PendingItemMessage = JSON.parse(newestMessage.message);

                        this.items[this.itemIndex] = {
                            itemType: ItemType[itemObj.pendingItem[0]],
                            itemSize: ItemSize[itemObj.pendingItem[1]],
                            itemPrice: null
                        }

                    } else if(newestMessage.topic === `gocircular/rvm/${this.rvmid}/output/transaction/EnteredItem`){
                        const itemObj: ItemEntryMessage = JSON.parse(newestMessage.message);

                        this.items[this.itemIndex] = {
                            itemType: ItemType[itemObj.enteredItem[0]],
                            itemSize: ItemSize[itemObj.enteredItem[1]],
                            itemPrice: itemObj.enteredItem[2]
                        }

                        this.itemIndex += 1;
                    } else if (newestMessage.topic === `gocircular/rvm/${this.rvmid}/output/transaction/report`){
                        this.completed = true;
                        this.itemIndex = 0;
                    } else {
                        console.log("Message with unhandled topic received");
                    }
                }
            )
        },


    }
})