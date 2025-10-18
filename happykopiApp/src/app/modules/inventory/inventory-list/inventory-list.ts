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
export class InventoryList implements OnInit, OnDestroy{
  stockitemsummaries: StockItemSummaryDto[] = [];
  actionSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private headerService: HeaderService, private router: Router) {}

  ngOnInit(): void {
    this.stockitemsummaries = this.route.snapshot.data['stockitemlist'];
    console.log('Data from resolver:', this.stockitemsummaries);

    this.actionSubscription = this.headerService.action$.subscribe(action => {
      if (action === 'ADD') {
        this.router.navigate(['../add-item'], {relativeTo: this.route});
      }
    });
  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }
}
