import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToggleButton } from '../../../shared/components/toggle-button/toggle-button';
import { Itemcard } from '../../../shared/components/itemcard/itemcard';
import { FormsModule } from '@angular/forms';
import { StockItemForCreateDto } from '../../../core/dtos/stockitem/stock-item-for-create-dto';
import { InventoryService } from '../services/inventory.service';
import { DropdownOption } from '../../../shared/components/dropdown-button/dropdown-option';
import { Stockitemtype } from '../../../core/enums/stockitemtype';
import { DropdownButton } from '../../../shared/components/dropdown-button/dropdown-button';
import { Subscription } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';
import { Location } from '@angular/common';
import { ExpiryDateCard } from '../components/expiry-date-card/expiry-date-card';
import { UnitGrouping } from '../../../core/enums/unit';
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service';

@Component({
  selector: 'app-inventory-add-item',
  imports: [ToggleButton, Itemcard, FormsModule, DropdownButton, ExpiryDateCard],
  templateUrl: './inventory-add-item.html',
  styleUrl: './inventory-add-item.css'
})
export class InventoryAddItem implements OnInit, OnDestroy {
  stockitemdetail !: StockItemForCreateDto;
  categories !: DropdownOption[];
  units !: DropdownOption[];

  unitSelected !: string;
  stockitemType !: number;
  private actionSubscription!: Subscription;

  constructor(
    private inventoryService: InventoryService,
    private headerActionService: HeaderService,
    private location: Location,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.categories = this.inventoryService.loadCategoryOptions(Stockitemtype);
    // console.log(this.categories);

    this.initializeEmptyDto();

    const passedState = history.state;

    if (passedState && passedState.itemType) {
      const categoryNameFromPreviousPage = passedState.itemType;

      const selectedCategory = this.categories.find(
        itemtype => itemtype.label.toLowerCase() === categoryNameFromPreviousPage.toLowerCase()
      );

      // console.log(`Did it match: ${selectedCategory}`);

      if (selectedCategory) {
        console.log(selectedCategory.value);
        this.stockitemdetail.itemType = selectedCategory.value;
      }
    }

    this.updateUnitsBasedOnCategory(this.stockitemdetail.itemType);

    this.actionSubscription = this.headerActionService.action$.subscribe(async action => {
      if (action === 'SAVE') {
        const confirmedSave = await this.confirmationService.confirm(
          'Confirm Save',
          `Are you sure you want to save these changes?`,
          'primary'
        );
        if (confirmedSave) {
          this.saveNewItem();
        }
      }
    })
  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }

  private saveNewItem(): void {
    if (!this.stockitemdetail.name || !this.stockitemdetail.unit) {
      alert('Please fill out all required fields.');
      return;
    }

    this.inventoryService.createStockItem(this.stockitemdetail).subscribe({
      next: (response) => {
        console.log('Item created successfully!', response);
        this.location.back();
      },
      error: (err) => {
        if (err.status === 409) {
          alert(`Error: ${err.error.message}`);
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
        console.error('Failed to create item:', err);
      }
    });
  }

  private initializeEmptyDto(): void {
    this.stockitemdetail = {
      name: '',
      unit: '',
      alertLevel: 10,
      isPerishable: false,
      itemType: Stockitemtype.Liquid,
      initialStockQuantity: 0,
    }
  }

  updateUnitsBasedOnCategory(itemType: Stockitemtype) {
    let unitGroup: string[] = [];

    switch (itemType) {
      case Stockitemtype.Liquid:
        unitGroup = UnitGrouping.Liquid;
        break;
      case Stockitemtype.Powder:
        unitGroup = UnitGrouping.Powder;
        break;
      case Stockitemtype.Miscellaneous:
        unitGroup = UnitGrouping.Miscellaneous;
        break;
      default:
        unitGroup = [];
        this.stockitemdetail.unit = '';
        break;
    }

    this.units = this.inventoryService.loadCategoryOptions(unitGroup);

    if (unitGroup.length > 0) {
      this.stockitemdetail.unit = unitGroup[0];
    }

    // console.log(`
    // ItemType Selected: ${itemType}
    // Units Available: ${unitGroup}
    // Units variable: ${this.units}
    // `);

  }
}