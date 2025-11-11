import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { ProductListItemDto } from '../../../../core/dtos/product/product.model';
import { ProductsService } from '../../services/products-service/products.service';

export const productsListResolver: ResolveFn<ProductListItemDto[]> = (route, state): Observable<ProductListItemDto[]> => {
  const productsService = inject(ProductsService);
  return productsService.getActiveProducts().pipe(
    catchError(err => {
      console.log(err);
      return [];
    })
  );
};
