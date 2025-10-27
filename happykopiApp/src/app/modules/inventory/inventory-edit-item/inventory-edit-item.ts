import { Component, OnDestroy, OnInit } from '@angular/core';
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { DropdownButton } from "../../../shared/components/dropdown-button/dropdown-button";
import { ToggleButton } from "../../../shared/components/toggle-button/toggle-button";
import { DropdownOption } from '../../../shared/components/dropdown-button/dropdown-option';
import { StockItemDetailsDto } from '../../../core/dtos/stockitem/stock-item-details-dto';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../../core/services/header/header.service';
import { InventoryService } from '../services/inventory.service';
import { Location } from '@angular/common';
import { StockItemForUpdateDto } from '../../../core/dtos/stockitem/stock-item-for-update-dto';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service';
import { UnitGrouping } from '../../../core/enums/unit';
import { StockItemType } from '../../../core/enums/stock-item-type';

@Component({
  selector: 'app-inventory-edit-item',
  imports: [Itemcard, DropdownButton, ToggleButton, FormsModule],
  templateUrl: './inventory-edit-item.html',
  styleUrl: './inventory-edit-item.css'
})
export class InventoryEditItem implements OnInit, OnDestroy {
  stockitemdetail!: StockItemDetailsDto;
  private stockitemDetailForUpdate!: StockItemForUpdateDto;

  categories!: DropdownOption[];
  units !: DropdownOption[];
  stockitemType!: number;

  private actionSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private headerActionService: HeaderService,
    private inventoryService: InventoryService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.stockitemdetail = this.route.snapshot.data['stockitemdetail'];
    this.stockitemType = this.stockitemdetail.itemType;
    this.categories = this.inventoryService.loadCategoryOptions(StockItemType);
    this.updateUnitsBasedOnCategory(this.stockitemdetail.itemType);

    this.actionSubscription = this.headerActionService.action$.subscribe(async action => {
      switch (action) {
        case 'SAVE':
          const confirmedSave = await this.confirmationService.confirm(
            'Add Item?',
            `Are you sure you want to save these changes?`,
            'primary'
          );
          if (confirmedSave) {
            this.updateStockItem();
          }
          break;
        case 'DELETE':
          const confirmedDelete = await this.confirmationService.confirm(
            'Delete Item?',
            `Are you sure you want to delete ${this.stockitemdetail.name}? This action cannot be undone.`,
            'danger'
          );
          if (confirmedDelete) {
            this.deleteStockItem();
          }
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
          this.location.back();
        },
        error: err => {
          console.error('Update failed: ' + err);
        }
      });
  }

  private deleteStockItem(): void {
    this.inventoryService.deactivateStockItem(this.stockitemdetail.id).subscribe({
      next: response => {
        console.log(`Update successful. ${response}`);
        this.router.navigate(['../../'], { relativeTo: this.route,  replaceUrl: true })
      },
      error: err => {
        console.error(`Update failed ${err}`);
      }
    })
  }

  updateUnitsBasedOnCategory(itemType: StockItemType) {
    let unitGroup: string[] = [];

    switch (itemType) {
      case StockItemType.Liquid:
        unitGroup = UnitGrouping.Liquid;
        break;
      case StockItemType.Powder:
        unitGroup = UnitGrouping.Powder;
        break;
      case StockItemType.Miscellaneous:
        unitGroup = UnitGrouping.Miscellaneous;
        break;
      default:
        unitGroup = [];
        this.stockitemdetail.unitOfMeasure = '';
        break;
    }

    this.units = this.inventoryService.loadCategoryOptions(unitGroup);

    if (unitGroup.length > 0) {
      this.stockitemdetail.unitOfMeasure = unitGroup[0];
    }
  }
}
