import { ResolveFn } from '@angular/router';
import { StockItemBatchDetailsDto } from '../../../../core/dtos/stockitem/stock-item-batch-details-dto';
import { inject } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { EMPTY, Observable, of } from 'rxjs';

export const stockItemBatchResolver: ResolveFn<StockItemBatchDetailsDto> = (route, state) : Observable<StockItemBatchDetailsDto> => {
  const inventoryService = inject(InventoryService);

  const stockItemIdParam = route.paramMap.get('stockitemid');
  const batchIdParam = route.paramMap.get('batchid');

  if (!stockItemIdParam || !batchIdParam) {
    console.error('Resolver Error: Missing stockitemid or batchid');
    return of();
  }

  const stockItemId = +stockItemIdParam;
  const batchId = +batchIdParam;

  if (isNaN(stockItemId) || isNaN(batchId)) {
    console.error('Resolver Error: Invalid ID parameters');
    return EMPTY; 
  }

  return inventoryService.getStockItemBatch(stockItemId, batchId);
};
