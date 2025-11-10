import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from '../services/products-service/products.service';
import { ModifierSize } from '../product-pages/add-drink-page/add-drink-page';
import { DropdownOption } from '../../../shared/components/dropdown-button/dropdown-option';

export const activeSizesResolver: ResolveFn<ModifierSize[]> = (): Observable<ModifierSize[]> => {
  return inject(ProductsService).getActiveSizes();
};

export const drinkCategoriesResolver: ResolveFn<DropdownOption[]> = (): Observable<DropdownOption[]> => {
  return inject(ProductsService).getActiveDrinkCategories();
};

export const ingredientsResolver: ResolveFn<DropdownOption[]> = (): Observable<DropdownOption[]> => {
  return inject(ProductsService).getActiveLiquidAndPowderStockItems();
};

export const addOnsResolver: ResolveFn<DropdownOption[]> = (): Observable<DropdownOption[]> => {
  return inject(ProductsService).getActiveAddOns();
};
