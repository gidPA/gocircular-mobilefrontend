export const ItemType: Array<string> = 
    [
        "Unknown Type",
        "Plastic Bottle - Transparent",
        "Plastic Bottle - Colored",
        "Metal Can"
    ];

export const ItemSize: Array<string> = 
    [
        "Unknown Size",
        "Small",
        "Medium",
        "Large"
    ];

export const ThumbnailLink: Array<string> = 
    [
        "",
        "/mobile/src/assets/transparent_bottle_minified.png",
        "/mobile/src/assets/transparent_bottle_minified.png",
        "/mobile/src/assets/soda_can_minified.png"
    ];


export interface RecyclableItem{
    itemType: string;
    itemSize: string;
    itemPrice: number | null;
}

export interface RecyclableEntryMessage{
    enteredItem: Array<number>;
}

export interface TransactionReportMessage{
    transactionDate: Date;
    userId: number;
    rvmId: number;
    recyclableItems: Array<Array<number>>;
}