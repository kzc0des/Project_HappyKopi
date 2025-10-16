import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockItemDetailsDto } from '../../../core/dtos/stockitem/stock-item-details-dto';
import { ActivatedRoute } from '@angular/router';
import { IngredientBatchCard } from "../components/ingredient-batch-card/ingredient-batch-card";
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { Subscription } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';

@Component({
  selector: 'app-inventory-item-detail',
  imports: [IngredientBatchCard, Itemcard],
  templateUrl: './inventory-item-detail.html',
  styleUrl: './inventory-item-detail.css'
})
export class InventoryItemDetail implements OnInit, OnDestroy {

  isEditing = false;
  private actionSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private headerActionService: HeaderService) { }

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

    this.actionSubscription = this.headerActionService.action$.subscribe(action => {
      
      switch (action) {
        case 'EDIT':
          this.isEditing = !this.isEditing;
          break;
        case 'DELETE':
          if (confirm('Are you sure you want to delete this item?')) {

          }
          break;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }
}
