import { Component } from '@angular/core';

export interface Category {
  name: string,
  quantity: number
}

@Component({
  selector: 'app-inventory-categories',
  imports: [],
  templateUrl: './inventory-categories.html',
  styleUrl: './inventory-categories.css'
})
export class InventoryCategories {
  categories: Category[] = [];

  

}
