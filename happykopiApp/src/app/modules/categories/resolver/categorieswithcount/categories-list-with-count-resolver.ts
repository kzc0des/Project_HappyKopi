import { ResolveFn } from '@angular/router';
import { CategoryWithProductCountDto } from '../../../../core/dtos/category/category-with-product-count-dto';
import { catchError, Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';

export const categoriesListWithCountResolver: ResolveFn<CategoryWithProductCountDto[]> = (route, state) : Observable<CategoryWithProductCountDto[]> => {
  const categoryService =  inject(CategoryService);

  return categoryService.getCategories().pipe(
    catchError(err => {
      console.error(`Resolve error failed. Cannot retrieve categories from the database. ${err}`);
      return of([]);
    })
  )
};
