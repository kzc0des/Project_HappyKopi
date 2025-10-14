export interface StockItemBatchForCreateDto {
    stockItemId: number;
    quantityAdded: number;
    expiryDate?: Date | null;
    remarks?: string;
}
