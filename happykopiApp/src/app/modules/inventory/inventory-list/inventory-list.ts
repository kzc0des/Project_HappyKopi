import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockItemSummaryDto } from '../../../core/dtos/stockitem/stock-item-summary-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchOrganizerCard } from "../components/batch-organizer-card/batch-organizer-card";
import { HeaderService } from '../../../core/services/header/header.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory-list',
  imports: [BatchOrganizerCard],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.css'
})
export class InventoryList implements OnInit, OnDestroy {
  stockitemsummaries: StockItemSummaryDto[] = [];
  actionSubscription!: Subscription;
  isDeleteSubscription !: Subscription;
  isDeleted = false;

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.stockitemsummaries = this.route.snapshot.data['stockitemlist'];
    // console.log('Data from resolver:', this.stockitemsummaries);

    this.isDeleteSubscription = this.headerService.isItemDeleted$.subscribe(changed => {
      this.isDeleted = changed;
    })

    this.actionSubscription = this.headerService.action$.subscribe(action => {
      if (action === 'ADD') {
        const currentCategory = this.route.snapshot.paramMap.get('itemType');

        this.router.navigate(['create'], {
          relativeTo: this.route,
          state: { itemType: currentCategory }
        });
      }

      else if (action === 'BACK') {
        if (this.isDeleted) {
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
    this.headerService.notifyItemDeleted(false);
    this.isDeleteSubscription.unsubscribe();
  }
}
