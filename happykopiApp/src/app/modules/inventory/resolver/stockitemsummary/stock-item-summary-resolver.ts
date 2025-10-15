import { ResolveFn } from '@angular/router';
import { StockItemSummaryDto } from '../../../../core/dtos/stockitem/stock-item-summary-dto';
import { catchError, Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

export const stockItemSummaryResolver: ResolveFn<StockItemSummaryDto[]> = (route, state): Observable<StockItemSummaryDto[]> => {
  const inventoryService = inject(InventoryService);
  const itemTypeParam = route.paramMap.get('itemType');

  console.log("Item Type Param:" + itemTypeParam);

  if (!itemTypeParam) {
    console.error('ItemType parameter not found in route!');
    return of([]); 
  }

  return inventoryService.getStockItemsSummaryByItemType(itemTypeParam).pipe(
    catchError(err => {
      console.error('Failed to retrieve stock item list by type', err);
      return of([]);
    })
  );
};
