import { Component, OnDestroy, OnInit } from '@angular/core';
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { DropdownButton } from "../../../shared/components/dropdown-button/dropdown-button";
import { ToggleButton } from "../../../shared/components/toggle-button/toggle-button";
import { DropdownOption } from '../../../shared/components/dropdown-button/dropdown-option';
import { StockItemDetailsDto } from '../../../core/dtos/stockitem/stock-item-details-dto';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../../core/services/header/header.service';
import { InventoryService } from '../services/inventory.service';
import { Location } from '@angular/common';
import { StockItemForUpdateDto } from '../../../core/dtos/stockitem/stock-item-for-update-dto';
import { FormsModule } from '@angular/forms';
import { Stockitemtype } from '../../../core/enums/stockitemtype';

@Component({
  selector: 'app-inventory-edit-item',
  imports: [Itemcard, DropdownButton, ToggleButton, FormsModule],
  templateUrl: './inventory-edit-item.html',
  styleUrl: './inventory-edit-item.css'
})
export class InventoryEditItem implements OnInit, OnDestroy {
  stockitemdetail!: StockItemDetailsDto;
  private stockitemDetailForUpdate!: StockItemForUpdateDto;

  isEditing = false;
  categories!: DropdownOption[];
  stockitemType!: number;

  private actionSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private headerActionService: HeaderService,
    private inventoryService: InventoryService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.stockitemdetail = this.route.snapshot.data['stockitemdetail'];
    this.stockitemType = this.stockitemdetail.itemType;
    this.categories = this.inventoryService.loadCategoryOptions(Stockitemtype);

    this.actionSubscription = this.headerActionService.action$.subscribe(action => {
      switch (action) {
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
          break;
      }
    })
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
