import { ResolveFn } from '@angular/router';
import { CategoryWithProductCountDto } from '../../../../core/dtos/order/category-with-product-count.dto';
import { catchError, Observable } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { inject } from '@angular/core';

export const categorySummaryResolver: ResolveFn<CategoryWithProductCountDto[]> = (route, state) : Observable<CategoryWithProductCountDto[]> => {
  const orderService = inject(OrderService);
  return orderService.getCategories().pipe(
    catchError((err) => {
      console.error(err);
      return [];
    })
  );
};
