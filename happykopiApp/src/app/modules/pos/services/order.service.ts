import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api/api.service';
import { CategoryWithProductCountDto } from '../../../core/dtos/order/category-with-product-count.dto';
import { ProductsWithCategoryDto } from '../../../core/dtos/order/products-with-category.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private api: ApiService) { }

  /**
   * Get all categories with the number of products in each
   */
  getCategories(): Observable<CategoryWithProductCountDto[]> {
    return this.api.get<CategoryWithProductCountDto[]>('order');
  }

  /**
   * Get all products under a specific category
   * @param categoryId Id of the category
   */
  getProductsByCategory(categoryId: number): Observable<ProductsWithCategoryDto[]> {
  return this.api.get<ProductsWithCategoryDto[]>(`order/category/${categoryId}`);
}
}