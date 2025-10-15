import { ResolveFn } from '@angular/router';
import { StockItemSummaryDto } from '../../../../core/dtos/stockitem/stock-item-summary-dto';
import { catchError, Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

export const stockItemSummaryResolver: ResolveFn<StockItemSummaryDto[]> = (route, state) : Observable<StockItemSummaryDto[]> => {
  const inventoryService = inject(InventoryService);

  return inventoryService.getStockItemsSummary().pipe(
    catchError(err => {
      console.error('Failed to retrieve stockitem list', err);
      return of ([]);
    })
  )
};
