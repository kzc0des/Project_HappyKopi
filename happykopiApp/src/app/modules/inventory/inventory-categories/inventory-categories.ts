import { Component, OnInit } from '@angular/core';
import { InventoryCategoryCard } from "../components/inventory-category-card/inventory-category-card";
import { InventoryService } from '../services/inventory.service';
import { ActivatedRoute } from '@angular/router';

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
export class InventoryCategories implements OnInit{

  constructor(private inventoryService: InventoryService, private route: ActivatedRoute) {}
  stockItemTypes: StockItemType[] = [];

  ngOnInit(): void {
    this.stockItemTypes = this.route.snapshot.data['stockitemtypecount'];
    console.log('Data from resolver:', this.stockItemTypes);
  }

}
