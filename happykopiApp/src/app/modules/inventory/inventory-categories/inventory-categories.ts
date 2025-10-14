import { Component } from '@angular/core';
import { InventoryCategoryCard } from "../components/inventory-category-card/inventory-category-card";

export interface StockItemType {
  name: string,
  quantity: number
}

@Component({
  selector: 'app-inventory-categories',
  imports: [InventoryCategoryCard],
  templateUrl: './inventory-categories.html',
  styleUrl: './inventory-categories.css'
})
export class InventoryCategories {
  stockItemTypes: StockItemType[] = [];



}
