import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StockItemSummaryDto } from '../../../core/dtos/stockitem/stock-item-summary-dto';
import { ApiService } from '../../../core/services/api/api.service';
import { StockItemDetailsDto } from '../../../core/dtos/stockitem/stock-item-details-dto';
import { StockItemTypeCountDto } from '../../../core/dtos/stockitem/stock-item-type-count-dto';
import { StockItemForCreateDto } from '../../../core/dtos/stockitem/stock-item-for-create-dto';
import { StockItemBatchForCreateDto } from '../../../core/dtos/stockitem/stock-item-batch-for-create-dto';
import { StockItemForUpdateDto } from '../../../core/dtos/stockitem/stock-item-for-update-dto';
import { StockItemForAdjustmentDto } from '../../../core/dtos/stockitem/stock-item-for-adjustment-dto';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly controllerPath = 'StockItems';

  constructor(private apiService: ApiService) { }

  getStockItemsSummary(): Observable<StockItemSummaryDto[]> {
    return this.apiService.get<StockItemSummaryDto[]>(`${this.controllerPath}/stock-items/summary`);
  }

  getStockItemsSummaryByItemType(itemType: number): Observable<StockItemSummaryDto[]> {
    return this.apiService.get<StockItemSummaryDto[]>(`${this.controllerPath}/stock-items/type/${itemType}`)
  }

  getStockItemDetailsById(id: number): Observable<StockItemDetailsDto> {
    return this.apiService.get<StockItemDetailsDto>(`${this.controllerPath}/stock-items/details/${id}`);
  }

  getStockItemTypeCounts(): Observable<StockItemTypeCountDto[]> {
    return this.apiService.get<StockItemTypeCountDto[]>(`${this.controllerPath}/stock-items/count-by-itemtype`);
  }

  createStockItem(item: StockItemForCreateDto): Observable<{ message: string }> {
    return this.apiService.post<{ message: string }>(`${this.controllerPath}/stock-items`, item);
  }

  addStockItemBatch(batch: StockItemBatchForCreateDto): Observable<{ message: string }> {
    return this.apiService.post<{ message: string }>(`${this.controllerPath}/stock-items/batches`, batch);
  }

  updateStockItem(id: number, item: StockItemForUpdateDto): Observable<{ message: string }> {
    return this.apiService.put<{ message: string }>(`${this.controllerPath}/stock-items/${id}`, item);
  }

  adjustStockQuantity(adjustment: StockItemForAdjustmentDto): Observable<{ message: string }> {
    return this.apiService.put<{ message: string }>(`${this.controllerPath}/stock-items/adjust`, adjustment);
  }

  deactivateStockItem(id: number): Observable<{ message: string }> {
    return this.apiService.delete<{ message: string }>(`${this.controllerPath}/stock-items/${id}`);
  }
}
