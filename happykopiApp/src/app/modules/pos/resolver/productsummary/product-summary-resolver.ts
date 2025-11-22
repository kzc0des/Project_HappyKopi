import { ResolveFn } from '@angular/router';
import { ProductsWithCategoryDto } from '../../../../core/dtos/order/products-with-category.dto';
import { catchError, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { OrderService } from '../../services/order.service';

export const productSummaryResolver: ResolveFn<ProductsWithCategoryDto[]> = (route, state) : Observable<ProductsWithCategoryDto[]> => {
  const orderService = inject(OrderService);
  const categoryId = route.queryParams['categoryId'];
  return orderService.getAllProducts(categoryId).pipe(
    catchError((err) => {
      console.error(err);
      return [];
    })
  );
};
