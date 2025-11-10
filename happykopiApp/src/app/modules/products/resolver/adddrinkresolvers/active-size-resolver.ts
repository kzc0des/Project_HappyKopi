import { ResolveFn } from '@angular/router';
import { ModifierDto } from '../../../../core/dtos/product/dropdowns/modifier-dto';
import { catchError, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { ProductsService } from '../../services/products-service/products.service';

export const activeSizeResolver: ResolveFn<ModifierDto[]> = (route, state): Observable<ModifierDto[]> => {
  const productService = inject(ProductsService);

  return productService.getActiveSizes().pipe(
    catchError(error => {
      console.error('Error fetching active sizes:', error);
      return [];
    }));
};
