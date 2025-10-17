import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockItemDetailsDto } from '../../../core/dtos/stockitem/stock-item-details-dto';
import { ActivatedRoute } from '@angular/router';
import { IngredientBatchCard } from "../components/ingredient-batch-card/ingredient-batch-card";
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { Subscription } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-inventory-item-detail',
  imports: [IngredientBatchCard, Itemcard],
  templateUrl: './inventory-item-detail.html',
  styleUrl: './inventory-item-detail.css'
})
export class InventoryItemDetail implements OnInit, OnDestroy {

  isEditing = false;
  private actionSubscription!: Subscription;

  stockitemdetail!: StockItemDetailsDto;
  private originalStockItemDetail!: StockItemDetailsDto;

  constructor(private route: ActivatedRoute, private headerActionService: HeaderService, private inventoryService: InventoryService) { }

  ngOnInit(): void {
    const resolvedData = this.route.snapshot.data['stockitemdetail'];
    this.stockitemdetail = { ...resolvedData };
    this.originalStockItemDetail = { ...resolvedData };

    console.log('Data from resolver:', this.stockitemdetail);

    this.actionSubscription = this.headerActionService.action$.subscribe(action => {

      switch (action) {
        case 'EDIT':
          this.isEditing = !this.isEditing;
          break;
        case 'SAVE':
          if (confirm('Save Changes?')) {
            
          }
          break;
        case 'DELETE':
          if (confirm('Are you sure you want to delete this item?')) {

          }
          break;
        case 'CANCEL':
          this.isEditing = false;
          this.stockitemdetail = { ...this.originalStockItemDetail };
          break;
      }
    });
  }

  updateAlertLevel(newValue: string): void {
    const numericValue = parseInt(newValue, 10);

    if (!isNaN(numericValue)) {
      this.stockitemdetail.alertLevel = numericValue;
    }
  }

  updateName(newValue: string): void {
    this.stockitemdetail.name = newValue;
  }

  updateUnitOfMeasure(newValue: string): void {
    this.stockitemdetail.unitOfMeasure = newValue;
  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }
}
