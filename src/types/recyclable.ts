export const ItemType: Array<string> = 
    [
        "Unknown Type",
        "Transparent Plastic Bottle",
        "Colored Plastic Bottle",
        "Metal Can"
    ];

export const ItemSize: Array<string> = 
    [
        "Unknown Size",
        "Small",
        "Medium",
        "Large"
    ];


export interface RecyclableItem{
    itemType: string,
    itemSize: string,
    itemPrice: number | null
}