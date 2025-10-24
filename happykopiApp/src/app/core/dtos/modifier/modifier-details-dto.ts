import { ModifierLinkStockItem } from "./modifier-link-stock-item.model";

export interface ModifierDetailsDto {
    id: number;
    name: string;
    price: number;
    type: string;
    isAvailable: boolean;
    ozAmount: number;
    linkedItems?: ModifierLinkStockItem[];
}
