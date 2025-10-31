import { ResolveFn } from '@angular/router';
import { CategoryWithProductCountDto } from '../../../../core/dtos/category/category-with-product-count-dto';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';

export const allDrinksCategoryWithCountResolver: ResolveFn<CategoryWithProductCountDto> = (route, state) : Observable<CategoryWithProductCountDto> => {
  const categoryService = inject(CategoryService);
};
