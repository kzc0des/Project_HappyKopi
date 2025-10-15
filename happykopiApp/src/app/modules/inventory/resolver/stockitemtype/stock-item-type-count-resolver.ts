import { ResolveFn } from '@angular/router';
import { StockItemTypeCountDto } from '../../../../core/dtos/stockitem/stock-item-type-count-dto';
import { catchError, Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

export const stockItemTypeCountResolver: ResolveFn<StockItemTypeCountDto[]> = (route, state) : Observable<StockItemTypeCountDto[]> => {
  const inventoryService = inject(InventoryService);

  return inventoryService.getStockItemTypeCounts().pipe(
    catchError(err => {
      console.error('Failed to retrieve stockitem types', err);
      return of ([]);
    })
  )  
};
