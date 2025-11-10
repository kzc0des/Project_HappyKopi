import { ResolveFn } from '@angular/router';
import { StockItemDto } from '../../../../core/dtos/product/dropdowns/stock-item-dto';
import { catchError, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { ProductsService } from '../../services/products-service/products.service';

export const powderAndLiquidsIngredientsResolver: ResolveFn<StockItemDto[]> = (route, state) : Observable<StockItemDto[]> => {
  const productService = inject(ProductsService);

  return productService.getActiveLiquidAndPowderStockItems().pipe(
    catchError(error => {
      console.error('Error fetching active ingredients:', error);
      return [];
    }));
};
