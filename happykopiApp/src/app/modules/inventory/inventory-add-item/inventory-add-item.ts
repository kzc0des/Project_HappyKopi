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

@Component({
  selector: 'app-inventory-add-item',
  imports: [ToggleButton, Itemcard, FormsModule, DropdownButton],
  templateUrl: './inventory-add-item.html',
  styleUrl: './inventory-add-item.css'
})
export class InventoryAddItem implements OnInit, OnDestroy {
  stockitemdetail !: StockItemForCreateDto;
  itemtypes !: DropdownOption[];
  private actionSubscription!: Subscription;

  constructor(
    private inventoryService: InventoryService,
    private headerActionService: HeaderService, // <-- Inject HeaderService
    private location: Location
  ) { }

  ngOnInit(): void {
    this.itemtypes = this.inventoryService.loadCategoryOptions(Stockitemtype);
    this.initializeEmptyDto();

    this.actionSubscription = this.headerActionService.action$.subscribe(action => {
      switch (action) {
        case 'SAVE':
          this.saveNewItem();
          break;
        case 'CANCEL':
          this.location.back();
          break;
      }
    });
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
    };
  }
}
