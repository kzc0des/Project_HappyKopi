import { ResolveFn } from '@angular/router';
import { ProductWithCategoryNameDto } from '../../../../core/dtos/category/product-with-category-name-dto';
import { catchError, Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';

export const productsInCategoryResolver: ResolveFn<ProductWithCategoryNameDto[] | null> = (route, state): Observable<ProductWithCategoryNameDto[] | null> => {
  const categoryService = inject(CategoryService);

  const categoryParam = route.paramMap.get('categoryId');

  if (categoryParam === null) {
    console.error('Resolver Error: The "categoryId" parameter was not found in the route. Full URL:', state.url);
    return of(null); 
  }

  const categoryId = parseInt(categoryParam, 10);

  return categoryService.getCategoryWithProducts(categoryId).pipe(
    catchError(err => {
      console.error(`Resolve error failed. Cannot retrieve categories from the database. ${err}`);
      return of(null);
    })
  )
};
