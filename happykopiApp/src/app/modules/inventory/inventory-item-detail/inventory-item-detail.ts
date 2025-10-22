import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockItemDetailsDto } from '../../../core/dtos/stockitem/stock-item-details-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientBatchCard } from "../components/ingredient-batch-card/ingredient-batch-card";
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { Subscription } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';
import { InventoryService } from '../services/inventory.service';
import { FormsModule } from '@angular/forms';
import { DropdownOption } from '../../../shared/components/dropdown-button/dropdown-option';
import { StockItemForUpdateDto } from '../../../core/dtos/stockitem/stock-item-for-update-dto';
import { StockItemType } from '../../../core/enums/stock-item-type';


@Component({
  selector: 'app-inventory-item-detail',
  imports: [IngredientBatchCard, Itemcard, FormsModule],
  templateUrl: './inventory-item-detail.html',
  styleUrl: './inventory-item-detail.css'
})
export class InventoryItemDetail implements OnInit, OnDestroy {

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.stockitemdetail = this.route.snapshot.data['stockitemdetail'];
    this.stockitemType = this.stockitemdetail.itemType;
    // console.log('Data from resolver:', this.stockitemdetail);

    this.actionSubscription = this.headerActionService.action$.subscribe(action => {

      if(action === 'EDIT') {
          this.isEditing = !this.isEditing;
          this.router.navigate(['../../edit/item', this.stockitemdetail.id], {relativeTo: this.route});
      }

    });

    this.categories = this.inventoryService.loadCategoryOptions(StockItemType);

  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }
}
