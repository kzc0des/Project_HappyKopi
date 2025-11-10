import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api/api.service';
import { CategoryWithProductCountDto } from '../../../core/dtos/order/category-with-product-count.dto';
import { ProductsWithCategoryDto } from '../../../core/dtos/order/products-with-category.dto';
import { ModifierType } from '../../../core/enums/modifier-type';
import { OrderModifierSummaryDto } from '../../../core/dtos/order/order-modifier-summary.to';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private api: ApiService) {}
 
  getCategories(): Observable<CategoryWithProductCountDto[]> {
    return this.api.get<CategoryWithProductCountDto[]>('order');
  }
 
  getProductsByCategory(categoryId: number): Observable<ProductsWithCategoryDto[]> {
    return this.api.get<ProductsWithCategoryDto[]>(`order/category/${categoryId}`);
  }

  getModifiersByType(type: ModifierType): Observable<OrderModifierSummaryDto[]> {
    const params = new HttpParams().set('modifierType', type.toString());
    return this.api.get<OrderModifierSummaryDto[]>(`modifiers`, params);
  }
}