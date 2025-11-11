import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductCreateDto } from '../../../../core/dtos/product/product-create-dto';
import { ApiService } from '../../../../core/services/api/api.service';
import { ModifierDto } from '../../../../core/dtos/product/dropdowns/modifier-dto';
import { StockItemDto } from '../../../../core/dtos/product/dropdowns/stock-item-dto';
import { CategoryDto } from '../../../../core/dtos/product/dropdowns/category-dto';
import { ProductListItemDto, ProductDetailDto, ProductUpdateDto } from '../../../../core/dtos/product/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private apiService: ApiService) { }

  getActiveSizes(): Observable<ModifierDto[]> {
    return this.apiService.get<ModifierDto[]>('products/sizes');
  }

  getActiveLiquidAndPowderStockItems(): Observable<StockItemDto[]> {
    return this.apiService.get<StockItemDto[]>('products/ingredients');
  }

  getActiveAddOns(): Observable<ModifierDto[]> {
    return this.apiService.get<ModifierDto[]>('products/addons');
  }

  getActiveDrinkCategories(): Observable<CategoryDto[]> {
    return this.apiService.get<CategoryDto[]>('products/categories');
  }

  createProduct(product: ProductCreateDto): Observable<{ productId: number }> {
    const formData = new FormData();

    formData.append('Name', product.name);
    formData.append('Description', product.description ? product.description : '');
    formData.append('CategoryId', product.categoryId.toString());
    formData.append('IsActive', product.isActive.toString());
    formData.append('IsAvailable', product.isAvailable.toString());

    if (product.imageFile) {
      formData.append('ImageFile', product.imageFile, product.imageFile.name);
    }

    formData.append('VariantsJson', JSON.stringify(product.variants));
    return this.apiService.post<{ productId: number }>('products', formData);
  }

  getActiveProducts(): Observable<ProductListItemDto[]> {
    return this.apiService.get<ProductListItemDto[]>('products');
  }

  getProductById(id: number): Observable<ProductDetailDto> {
    return this.apiService.get<ProductDetailDto>(`products/${id}`);
  }

  updateProduct(id: number, product: ProductUpdateDto): Observable<void> {
    const formData = new FormData();

    formData.append('Name', product.name);
    formData.append('Description', product.description ? product.description : '');
    formData.append('CategoryId', product.categoryId.toString());
    formData.append('IsActive', product.isActive.toString());
    formData.append('IsAvailable', product.isAvailable.toString());

    if (product.imageFile) {
      formData.append('ImageFile', product.imageFile, product.imageFile.name);
    }

    formData.append('VariantsJson', JSON.stringify(product.variants));
    return this.apiService.put<void>(`products/${id}`, formData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.apiService.delete<void>(`products/${id}`);
  }
}
