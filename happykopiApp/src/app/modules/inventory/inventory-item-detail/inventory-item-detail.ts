import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockItemDetailsDto } from '../../../core/dtos/stockitem/stock-item-details-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientBatchCard } from "../components/ingredient-batch-card/ingredient-batch-card";
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { Subscription } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';
import { InventoryService } from '../services/inventory.service';
import { FormsModule } from '@angular/forms';
import { ToggleButton } from "../../../shared/components/toggle-button/toggle-button";
import { DropdownOption } from '../../../shared/components/dropdown-button/dropdown-option';
import { DropdownButton } from "../../../shared/components/dropdown-button/dropdown-button";
import { Stockitemtype } from '../../../core/enums/stockitemtype';
import { StockItemForUpdateDto } from '../../../core/dtos/stockitem/stock-item-for-update-dto';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-inventory-item-detail',
  imports: [IngredientBatchCard, Itemcard, FormsModule, ToggleButton, DropdownButton],
  templateUrl: './inventory-item-detail.html',
  styleUrl: './inventory-item-detail.css'
})
export class InventoryItemDetail implements OnInit, OnDestroy {

  stockitemType!: number;

  categories: DropdownOption[] = [];

  isEditing = false;
  private actionSubscription!: Subscription;

  stockitemdetail!: StockItemDetailsDto;
  stockitemDetailForUpdate!: StockItemForUpdateDto;
  private originalStockItemDetail!: StockItemDetailsDto;

  constructor(
    private route: ActivatedRoute,
    private headerActionService: HeaderService,
    private inventoryService: InventoryService,
  ) { }

  ngOnInit(): void {
    const resolvedData = this.route.snapshot.data['stockitemdetail'];
    this.stockitemdetail = { ...resolvedData };
    this.originalStockItemDetail = { ...resolvedData };

    console.log('Data from resolver:', this.stockitemdetail);

    this.stockitemType = this.stockitemdetail.itemType;

    this.actionSubscription = this.headerActionService.action$.subscribe(action => {

      switch (action) {
        case 'EDIT':
          this.isEditing = !this.isEditing;
          break;
        case 'SAVE':
          if (confirm('Save Changes?')) {
            this.updateStockItem();
            this.isEditing = !this.isEditing;
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

    this.loadCategoryOptions();

  }

  private loadCategoryOptions(): void {
    this.categories = Object.keys(Stockitemtype)
      .filter(key => isNaN(Number(key)))
      .map(key => ({
        // The value is the NUMBER from the enum (e.g., 0, 1, 2)
        value: Stockitemtype[key as keyof typeof Stockitemtype],
        // The label is the string key itself (e.g., "Liquid")
        label: key,
      }));
  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }

  private updateStockItem(): void {
    this.stockitemDetailForUpdate = {
      name: this.stockitemdetail.name,
      unit: this.stockitemdetail.unitOfMeasure,
      alertLevel: this.stockitemdetail.alertLevel,
      isPerishable: this.stockitemdetail.isPerishable,
      itemType: this.stockitemdetail.itemType
    }

    this.inventoryService.updateStockItem(this.stockitemdetail.id, this.stockitemDetailForUpdate)
      .subscribe({
        next: (response) => {
          console.log("Update successful.", response);
        },
        error: err => {
          console.error('Update failed: ' + err);
        }
      });
  }

  private deleteStockItem(): void {
      
  }
}
