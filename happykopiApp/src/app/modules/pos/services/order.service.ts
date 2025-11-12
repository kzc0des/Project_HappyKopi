import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api/api.service';
import { CategoryWithProductCountDto } from '../../../core/dtos/order/category-with-product-count.dto';
import { ProductsWithCategoryDto } from '../../../core/dtos/order/products-with-category.dto';
import { ModifierType } from '../../../core/enums/modifier-type';
import { OrderModifierSummaryDto } from '../../../core/dtos/order/order-modifier-summary.to';
import { HttpParams } from '@angular/common/http';
import { ProductConfigurationResultDto } from '../../../core/dtos/order/product-configuration-result.dto';
import { NewOrderRequestDto } from '../../../core/dtos/order/new-order-request.dto';
import { NewOrderResponseDto } from '../../../core/dtos/order/new-order-response.dto';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly endpoint = 'order';

  constructor(private api: ApiService) {}

  getCategories(): Observable<CategoryWithProductCountDto[]> {
    return this.api.get<CategoryWithProductCountDto[]>(this.endpoint);
  }

  getProductsByCategory(categoryId: number): Observable<ProductsWithCategoryDto[]> {
    return this.api.get<ProductsWithCategoryDto[]>(`${this.endpoint}/category/${categoryId}`);
  }

  getModifiersByType(type: ModifierType): Observable<OrderModifierSummaryDto[]> {
    const params = new HttpParams().set('modifierType', type.toString());
    return this.api.get<OrderModifierSummaryDto[]>(`${this.endpoint}/modifiers`, params);
  }

  getProductConfiguration(productId: number): Observable<ProductConfigurationResultDto> {
    return this.api.get<ProductConfigurationResultDto>(
      `${this.endpoint}/configuration/${productId}`
    );
  }

  getModifiersByIds(modifierIds: number[]): Observable<OrderModifierSummaryDto[]> {
    return this.api.post<OrderModifierSummaryDto[]>(
      `${this.endpoint}/modifiers/by-ids`,
      modifierIds
    );
  }

  createOrder(orderRequest: NewOrderRequestDto): Observable<NewOrderResponseDto> {
    return this.api.post<NewOrderResponseDto>(this.endpoint, orderRequest);
  }
}
