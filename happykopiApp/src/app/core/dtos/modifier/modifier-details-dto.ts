import { ModifierLinkStockItem } from "./modifier-link-stock-item.model";

export interface ModifierDetailsDto {
    id: number;
    name: string;
    price: number;
    type: number;
    isAvailable: boolean;
    isActive: boolean;
    ozAmount?: number;
    linkedItems?: ModifierLinkStockItem[];
}
