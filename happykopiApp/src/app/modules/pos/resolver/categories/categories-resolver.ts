import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';  
import { OrderService } from '../../services/order.service';
import { CategoryWithProductCountDto } from '../../../../core/dtos/order/category-with-product-count.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoriesResolver implements Resolve<CategoryWithProductCountDto[]> {
  
  constructor(private orderService: OrderService) {}

  resolve(): Observable<CategoryWithProductCountDto[]> {
    return this.orderService.getCategories().pipe(
      catchError(err => {
        console.error('Failed to load categories in resolver', err);
        return of([]); // fallback to empty array
      })
    );
  }
}
