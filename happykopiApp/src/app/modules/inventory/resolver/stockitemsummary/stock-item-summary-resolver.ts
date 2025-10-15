import { ResolveFn } from '@angular/router';
import { StockItemSummaryDto } from '../../../../core/dtos/stockitem/stock-item-summary-dto';
import { catchError, Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

export const stockItemSummaryResolver: ResolveFn<StockItemSummaryDto[]> = (route, state): Observable<StockItemSummaryDto[]> => {
  const inventoryService = inject(InventoryService);
  const itemTypeParam = route.paramMap.get('itemType');

  if (!itemTypeParam) {
    console.error('ItemType parameter not found in route!');
    return of([]);
  }

  const itemType = Number(itemTypeParam);

  if (isNaN(itemType)) {
    console.error('ItemType parameter is not a valid number!');
    return of([]);
  }

  return inventoryService.getStockItemsSummaryByItemType(itemType).pipe(
    catchError(err => {
      console.error('Failed to retrieve stockitem list', err);
      return of([]);
    })
  )
};
