export interface StockItemForCreateDto {
    name: string;
    unit: string;
    alertLevel: number;
    isPerishable: boolean;
    itemType: number;
    initialStockQuantity?: number;
    expiryDate?: Date | null;
}
