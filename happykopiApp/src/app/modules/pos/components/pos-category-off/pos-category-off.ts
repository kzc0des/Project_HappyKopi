import { Component, Input } from '@angular/core';
import { cartItemDto } from '../cart-item/cart-item';

export interface categoryDto {
  CategoryName: string,
  CategoryQuantity: number
}

@Component({
  selector: 'app-pos-category-off',
  imports: [],
  templateUrl: './pos-category-off.html',
  styleUrl: './pos-category-off.css'
})
export class PosCategoryOff {
  @Input() mode: 'active' | 'inactive' = 'inactive';
  @Input() categoryCard!: categoryDto;
}
