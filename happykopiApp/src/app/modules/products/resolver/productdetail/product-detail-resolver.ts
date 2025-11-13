import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductDetailDto } from '../../../../core/dtos/product/product.model';
import { ProductsService } from '../../services/products-service/products.service';

export const productDetailResolver: ResolveFn<ProductDetailDto> = (
    route: ActivatedRouteSnapshot
): Observable<ProductDetailDto> => {
    const id = route.paramMap.get('id');
    const productId = Number(id);
    if (isNaN(productId)) {
        inject(Router).navigate(['/products']); // Example: navigate back to list
        return of({} as ProductDetailDto); // Or handle as an error
    }
    const productsService = inject(ProductsService);
    return productsService.getProductById(productId);
};
