import { StockItemBatchDetailsDto } from "./stock-item-batch-details-dto";

export interface StockItemDetailsDto {
    id: number;
    name: string;
    unit: string;
    alertLevel: number;
    isPerishable: boolean;
    itemType: number;
    isActive: boolean;
    totalStockQuantity: number;
    batches: StockItemBatchDetailsDto[];
}
