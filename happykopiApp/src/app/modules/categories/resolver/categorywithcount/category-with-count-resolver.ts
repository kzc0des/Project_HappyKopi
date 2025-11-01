import { ResolveFn } from '@angular/router';
import { CategoryWithProductCountDto } from '../../../../core/dtos/category/category-with-product-count-dto';
import { catchError, Observable, of, tap } from 'rxjs';
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

  console.log('Resolver: Attempting to fetch category with ID:', categoryId);

  return categoryService.getCategoryById(categoryId).pipe(
    tap(data => {
      console.log('Resolver Success: Got data:', data);
    }),
    catchError(err => {
      // === DEBUGGING: Log the actual error object ===
      console.error('--- RESOLVER CATCHERROR BLOCK ---');
      console.error('Resolve error failed. The "err" object is:', err);
      console.error('---------------------------------');
      return of(null);
    })
  )
};
