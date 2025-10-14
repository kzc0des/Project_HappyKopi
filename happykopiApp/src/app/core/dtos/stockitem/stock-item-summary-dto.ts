export interface StockItemSummaryDto {
    id: number;
    name: string;
    unitOfMeasure: string;
    totalStockQuantity: number;
    alertLevel: number;
    isActive: boolean;
    batchCount: number;
}
