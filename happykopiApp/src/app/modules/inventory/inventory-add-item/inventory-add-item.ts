import { Component, OnInit } from '@angular/core';
import { ToggleButton } from '../../../shared/components/toggle-button/toggle-button';
import { Itemcard } from '../../../shared/components/itemcard/itemcard';
import { FormsModule } from '@angular/forms';
import { StockItemForCreateDto } from '../../../core/dtos/stockitem/stock-item-for-create-dto';
import { InventoryService } from '../services/inventory.service';
import { DropdownOption } from '../../../shared/components/dropdown-button/dropdown-option';
import { Stockitemtype } from '../../../core/enums/stockitemtype';
import { DropdownButton } from '../../../shared/components/dropdown-button/dropdown-button';

@Component({
  selector: 'app-inventory-add-item',
  imports: [ToggleButton, Itemcard, FormsModule, DropdownButton],
  templateUrl: './inventory-add-item.html',
  styleUrl: './inventory-add-item.css'
})
export class InventoryAddItem implements OnInit{
  stockitemdetail !: StockItemForCreateDto;
  itemtypes !: DropdownOption[];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.itemtypes = this.inventoryService.loadCategoryOptions(Stockitemtype);
  }
}
