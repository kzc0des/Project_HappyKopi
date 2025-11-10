import { ResolveFn } from '@angular/router';
import { CategoryDto } from '../../../../core/dtos/product/dropdowns/category-dto';
import { catchError, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { ProductsService } from '../../services/products-service/products.service';

export const drinkCategoriesResolver: ResolveFn<CategoryDto[]> = (route, state) : Observable<CategoryDto[]> => {
  const productService = inject(ProductsService);

  return productService.getActiveDrinkCategories().pipe(
    catchError(error => {
      console.error('Error fetching active drink categories:', error);
      return [];
    }));
};
