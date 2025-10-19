import { ResolveFn } from '@angular/router';
import { StockItemDetailsDto } from '../../../../core/dtos/stockitem/stock-item-details-dto';
import { inject } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { catchError, Observable, of } from 'rxjs';

export const stockitemdetailResolver: ResolveFn<StockItemDetailsDto> = (route, state): Observable<StockItemDetailsDto> => {
  const inventoryService = inject(InventoryService);

  const itemIdParam = route.paramMap.get('itemId');
  const itemId = Number(itemIdParam);

  // console.log("Item Type Param:" + itemId);

  if (!itemId) {
    console.error('ItemType parameter not found in route!');
    return of();
  }


  return inventoryService.getStockItemDetailsById(itemId).pipe(
    catchError(err => {
      console.error('Failed to load specific item', err);
      return of ();
    })
  )
};
