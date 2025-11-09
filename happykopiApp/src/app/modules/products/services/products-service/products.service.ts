import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductCreateDto } from '../../../../core/dtos/product/product-create-dto';
import { DropdownOption } from '../../../../shared/components/dropdown-button/dropdown-option';
import { ModifierSize } from '../../product-pages/add-drink-page/add-drink-page';
import { ApiService } from '../../../../core/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private apiService: ApiService) { }

  getActiveSizes(): Observable<ModifierSize[]> {
    return this.apiService.get<ModifierSize[]>('products/sizes');
  }

  getActiveLiquidAndPowderStockItems(): Observable<DropdownOption[]> {
    return this.apiService.get<DropdownOption[]>('products/ingredients');
  }

  getActiveAddOns(): Observable<DropdownOption[]> {
    return this.apiService.get<DropdownOption[]>('products/addons');
  }

  getActiveDrinkCategories(): Observable<DropdownOption[]> {
    return this.apiService.get<DropdownOption[]>('products/categories');
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
