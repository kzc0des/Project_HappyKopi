import { ResolveFn } from '@angular/router';
import { CategoryWithProductCountDto } from '../../../../core/dtos/category/category-with-product-count-dto';
import { catchError, Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';

export const categoryWithCountResolver: ResolveFn<CategoryWithProductCountDto | null> = (route, state): Observable<CategoryWithProductCountDto | null> => {
  const categoryService = inject(CategoryService);

  const categoryParam = route.paramMap.get('categoryId');

  if (categoryParam === null) {
    console.error('Resolver Error: The "itemId" parameter was not found in the route. Full URL:', state.url);
    return of(null); 
  }

  const categoryId = parseInt(categoryParam, 10);

  return categoryService.getCategoryById(categoryId).pipe(
    catchError(err => {
      console.error(`Resolve error failed. Cannot retrieve categories from the database. ${err}`);
      return of(null);
    })
  )
};
