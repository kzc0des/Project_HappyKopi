import { Component, OnDestroy, OnInit } from '@angular/core';
import { InventoryCategoryCard } from "../components/inventory-category-card/inventory-category-card";
import { InventoryService } from '../services/inventory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StockItemTypeCountDto } from '../../../core/dtos/stockitem/stock-item-type-count-dto';
import { HeaderService } from '../../../core/services/header/header.service';
import { Subscription } from 'rxjs';
import { Stockitemtype } from '../../../core/enums/stockitemtype';

@Component({
  selector: 'app-inventory-categories',
  imports: [InventoryCategoryCard],
  templateUrl: './inventory-categories.html',
  styleUrl: './inventory-categories.css'
})
export class InventoryCategories implements OnInit, OnDestroy{

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private router: Router
  ) {}

  stockItemTypes: StockItemTypeCountDto[] = [];
  actionSubscription!: Subscription;
  stockItemTypeDisplay: StockItemTypeCountDto[] = [
    {
      itemTypeName: 'Liquid',
      stockItemCount: 0
    },
    {
      itemTypeName: 'Powder',
      stockItemCount: 0
    },
    {
      itemTypeName: 'Miscellaneous',
      stockItemCount: 0
    }
  ];

  ngOnInit(): void {
    this.stockItemTypes = this.route.snapshot.data['stockitemtypecount'];
    // console.log('Data from resolver:', this.stockItemTypes);

    this.stockItemTypeDisplay.forEach(type => {
      const target = this.stockItemTypes.find((t) => t.itemTypeName === type.itemTypeName);
      if(target){
        type.stockItemCount = target.stockItemCount;
      }
    })

    this.actionSubscription = this.headerService.action$.subscribe(action => {
      if (action === 'ADD') {
        this.router.navigate(['add-item'], {relativeTo: this.route});
      }
    })

  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }

}
