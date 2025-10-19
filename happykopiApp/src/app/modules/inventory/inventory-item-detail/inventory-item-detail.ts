import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockItemDetailsDto } from '../../../core/dtos/stockitem/stock-item-details-dto';
import { ActivatedRoute } from '@angular/router';
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
import { Location } from '@angular/common';


@Component({
  selector: 'app-inventory-item-detail',
  imports: [IngredientBatchCard, Itemcard, FormsModule, ToggleButton, DropdownButton],
  templateUrl: './inventory-item-detail.html',
  styleUrl: './inventory-item-detail.css'
})
export class InventoryItemDetail implements OnInit, OnDestroy {

  private originalStockItemDetail!: StockItemDetailsDto;
  stockitemType!: number;
  categories!: DropdownOption[];
  isEditing = false;

  stockitemdetail!: StockItemDetailsDto;
  stockitemDetailForUpdate!: StockItemForUpdateDto;

  private actionSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private headerActionService: HeaderService,
    private inventoryService: InventoryService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    const resolvedData = this.route.snapshot.data['stockitemdetail'];
    this.stockitemdetail = { ...resolvedData };
    this.originalStockItemDetail = { ...resolvedData };

    // console.log('Data from resolver:', this.stockitemdetail);

    this.stockitemType = this.stockitemdetail.itemType;

    this.actionSubscription = this.headerActionService.action$.subscribe(action => {

      switch (action) {
        case 'EDIT':
          this.isEditing = !this.isEditing;
          break;
        case 'SAVE':
          if (confirm('Save Changes?')) {
            this.updateStockItem();
          }
          break;
        case 'DELETE':
          if (confirm('Are you sure you want to delete this item?')) {
            this.deleteStockItem();
          }
          break;
        case 'CANCEL':
          this.isEditing = false;
          this.stockitemdetail = { ...this.originalStockItemDetail };
          break;
      }
    });

    this.categories = this.inventoryService.loadCategoryOptions(Stockitemtype);

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
          this.isEditing = false;
        },
        error: err => {
          console.error('Update failed: ' + err);
          this.isEditing = false;
        }
      });
  }

  private deleteStockItem(): void {
    this.inventoryService.deactivateStockItem(this.stockitemdetail.id).subscribe({
      next: response => {
        console.log(`Update successful. ${response}`);
        this.location.back();
      },
      error: err => {
        console.error(`Update failed ${err}`);
      }
    })
  }
}
