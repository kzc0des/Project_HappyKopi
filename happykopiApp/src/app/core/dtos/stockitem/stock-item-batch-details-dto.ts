export interface StockItemBatchDetailsDto {
    id: number;
    stockQuantity: number;
    expiryDate?: Date;
    dateReceived: Date;
    remarks: string;
}
