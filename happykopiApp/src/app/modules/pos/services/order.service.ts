// features/order/services/order.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api/api.service';
import { CategoryWithProductCountDto } from '../../../core/dtos/order/category-with-product-count.dto';
import { ProductsWithCategoryDto } from '../../../core/dtos/order/products-with-category.dto';
import { ModifierType } from '../../../core/enums/modifier-type';
import { OrderModifierSummaryDto } from '../../../core/dtos/order/order-modifier-summary.to';
import { HttpParams } from '@angular/common/http';
import { ProductConfigurationResultDto } from '../../../core/dtos/order/product-configuration-result.dto';
import { NewOrderRequestDto } from '../../../core/dtos/order/new-order-request.dto';
import { NewOrderResponseDto } from '../../../core/dtos/order/new-order-response.dto';
import {
  ProductAvailabilityResponseDto,
  UnavailableProductDto,
} from '../../../core/dtos/order/product-availability.dto';

export interface ProductsWithAvailabilityResult {
  products: ProductsWithCategoryDto[];
  unavailableMap: Map<number, UnavailableProductDto>;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly controller = 'order';

  constructor(private api: ApiService) {}

  getCategories(): Observable<CategoryWithProductCountDto[]> {
    return this.api.get<CategoryWithProductCountDto[]>(`${this.controller}/categories`);
  }

  getAllProducts(categoryId: number | null): Observable<ProductsWithCategoryDto[]> {
    let url = `${this.controller}/products`;
    if (categoryId) {
      url += `?categoryId=${categoryId}`;
    }
    return this.api.get<ProductsWithCategoryDto[]>(url);
  }

  getProductsByCategory(categoryId: number): Observable<ProductsWithCategoryDto[]> {
    return this.api.get<ProductsWithCategoryDto[]>(`${this.controller}/category/${categoryId}`);
  }

  getModifiersByType(type: ModifierType): Observable<OrderModifierSummaryDto[]> {
    const params = new HttpParams().set('modifierType', type.toString());
    return this.api.get<OrderModifierSummaryDto[]>(`${this.controller}/modifiers`, params);
  }

  getProductConfiguration(productId: number): Observable<ProductConfigurationResultDto> {
    return this.api.get<ProductConfigurationResultDto>(
      `${this.controller}/configuration/${productId}`
    );
  }

  getModifiersByIds(modifierIds: number[]): Observable<OrderModifierSummaryDto[]> {
    return this.api.post<OrderModifierSummaryDto[]>(
      `${this.controller}/modifiers/by-ids`,
      modifierIds
    );
  }

  createOrder(orderRequest: NewOrderRequestDto): Observable<NewOrderResponseDto> {
    return this.api.post<NewOrderResponseDto>(this.controller, orderRequest);
  }

  // NEW: Get products with availability info
  getProductsWithAvailability(categoryId?: number): Observable<ProductsWithAvailabilityResult> {
    const params = categoryId
      ? new HttpParams().set('categoryId', categoryId.toString())
      : undefined;

    return this.api
      .get<ProductAvailabilityResponseDto>(`${this.controller}/availability`, params)
      .pipe(
        map((response) => {
          // Map available products
          const availableProducts: ProductsWithCategoryDto[] = response.availableProducts.map(
            (p) => ({
              id: p.productId,
              name: p.productName,
              categoryName: p.categoryName,
              categoryId: 0,
              price: p.price,
              imageUrl: p.imageUrl ?? undefined,
              isAvailable: true,
            })
          );

          // Map unavailable products
          const unavailableProducts: ProductsWithCategoryDto[] = response.unavailableProducts.map(
            (p) => ({
              id: p.productId,
              name: p.productName,
              categoryName: p.categoryName,
              categoryId: 0,
              price: p.price,
              imageUrl: p.imageUrl ?? undefined,
              isAvailable: false,
            })
          );

          // Combine: available first, unavailable at the end
          const allProducts = [...availableProducts, ...unavailableProducts];

          // Create map for unavailable details
          const unavailableMap = new Map<number, UnavailableProductDto>();
          response.unavailableProducts.forEach((p) => {
            unavailableMap.set(p.productId, p);
          });

          return { products: allProducts, unavailableMap };
        })
      );
  }
}