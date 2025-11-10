import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductCreateDto } from '../../../../core/dtos/product/product-create-dto';
import { DropdownOption } from '../../../../shared/components/dropdown-button/dropdown-option';
import { ApiService } from '../../../../core/services/api/api.service';
import { ModifierDto } from '../../../../core/dtos/product/dropdowns/modifier-dto';
import { StockItemDto } from '../../../../core/dtos/product/dropdowns/stock-item-dto';
import { CategoryDto } from '../../../../core/dtos/product/dropdowns/category-dto';

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

    formData.append('name', product.name);
    formData.append('description', product.description ? product.description : '');
    formData.append('categoryId', product.categoryId.toString());
    formData.append('isActive', product.isActive.toString());
    formData.append('isAvailable', product.isAvailable.toString());

    if (product.imageFile) {
      formData.append('imageFile', product.imageFile, product.imageFile.name);
    }

    formData.append('variantsJson', JSON.stringify(product.variants));

    return this.apiService.post<{ productId: number }>('products', formData);
  }
}
