import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryWithProductCountDto } from '../../../core/dtos/category/category-with-product-count-dto';
import { ApiService } from '../../../core/services/api/api.service';
import { CategoryForCreateUpdateDto } from '../../../core/dtos/category/category-for-create-update-dto';
import { ProductWithCategoryNameDto } from '../../../core/dtos/category/product-with-category-name-dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly controllerPath = 'Categories';

  constructor(private readonly apiService: ApiService) { }

  getCategories(): Observable<CategoryWithProductCountDto[]> {
    return this.apiService.get<CategoryWithProductCountDto[]>(this.controllerPath);
  }

  getCategoryWithProducts(id: number): Observable<ProductWithCategoryNameDto> {
    const path = `${this.controllerPath}/assign/${id}`;
    return this.apiService.get<ProductWithCategoryNameDto>(path);
  }

  getCategoryById(id: number): Observable<CategoryWithProductCountDto> {
    const path = `${this.controllerPath}/${id}`;
    return this.apiService.get<CategoryWithProductCountDto>(path);
  }

  createCategory(categoryData: CategoryForCreateUpdateDto): Observable<{ message: string }> {
    return this.apiService.post<{ message: string }>(this.controllerPath, categoryData);
  }

  updateCategory(id: number, categoryData: CategoryForCreateUpdateDto): Observable<void> {
    const path = `${this.controllerPath}/${id}`;
    return this.apiService.put<void>(path, categoryData);
  }

  deleteCategory(id: number): Observable<void> {
    const path = `${this.controllerPath}/${id}`;
    return this.apiService.delete<void>(path);
  }
}
