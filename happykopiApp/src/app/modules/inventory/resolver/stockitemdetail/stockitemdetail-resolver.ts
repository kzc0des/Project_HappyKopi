import { ResolveFn } from '@angular/router';
import { StockItemDetailsDto } from '../../../../core/dtos/stockitem/stock-item-details-dto';
import { inject } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { catchError, Observable, of } from 'rxjs';

export const stockitemdetailResolver: ResolveFn<StockItemDetailsDto | null> = (route, state): Observable<StockItemDetailsDto | null> => {
  const inventoryService = inject(InventoryService);

const itemIdParam = route.paramMap.get('itemId');

  if (itemIdParam === null) {
    console.error('Resolver Error: The "itemId" parameter was not found in the route. Full URL:', state.url);
    return of(null); 
  }

  const itemId = parseInt(itemIdParam, 10);

  if (isNaN(itemId)) {
    console.error(`Resolver Error: The "itemId" parameter ("${itemIdParam}") is not a valid number. Full URL:`, state.url);
    return of(null);
  }

  console.log(`Resolver: Fetching details for itemId: ${itemId}`);
  return inventoryService.getStockItemDetailsById(itemId).pipe(
    catchError(err => {
      console.error(`Resolver Error: Failed to fetch data for item ID ${itemId}.`, err);
      return of(null);
    })
  );
};
