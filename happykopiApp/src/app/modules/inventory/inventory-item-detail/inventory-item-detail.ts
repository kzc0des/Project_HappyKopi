import { Component, OnInit } from '@angular/core';
import { StockItemDetailsDto } from '../../../core/dtos/stockitem/stock-item-details-dto';
import { ActivatedRoute } from '@angular/router';
import { IngredientBatchCard } from "../components/ingredient-batch-card/ingredient-batch-card";
import { Itemcard } from "../../../shared/components/itemcard/itemcard";

@Component({
  selector: 'app-inventory-item-detail',
  imports: [IngredientBatchCard, Itemcard],
  templateUrl: './inventory-item-detail.html',
  styleUrl: './inventory-item-detail.css'
})
export class InventoryItemDetail implements OnInit{
  constructor(private route: ActivatedRoute) {}

  stockitemdetail: StockItemDetailsDto = {
    id: 0,
    name: '',
    unitOfMeasure: '',
    alertLevel: 0,
    isPerishable: false,
    itemType: 0,
    isActive: true,
    totalStockQuantity: 0,
    batches: []
  }

  ngOnInit(): void {
    this.stockitemdetail = this.route.snapshot.data['stockitemdetail'];
    console.log('Data from resolver:', this.stockitemdetail);
  }
}
