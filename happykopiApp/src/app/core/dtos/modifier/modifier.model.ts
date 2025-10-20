import { LinkedStockItem } from "./linked-stock-item.model";

export interface Modifier {
    id: number;
    name: string;
    price: number;
    type: string;
    isAvailable: boolean;
    linkedItems?: LinkedStockItem[];
}
