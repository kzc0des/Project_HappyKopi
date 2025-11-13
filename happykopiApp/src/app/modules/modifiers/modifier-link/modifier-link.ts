import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockItemSummaryDto } from '../../../core/dtos/stockitem/stock-item-summary-dto';
import { BatchOrganizerCard } from '../../inventory/components/batch-organizer-card/batch-organizer-card';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../../core/services/header/header.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modifier-link',
  imports: [BatchOrganizerCard, CommonModule],
  templateUrl: './modifier-link.html',
  styleUrl: './modifier-link.css',
})
export class ModifierLink implements OnInit, OnDestroy {
  stockitemsummaries: StockItemSummaryDto[] = [];
  actionSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.stockitemsummaries = this.route.snapshot.data['stockitemlist'];
    this.actionSubscription = this.headerService.action$.subscribe(action => {
      if (action === 'BACK') {
        this.router.navigate(['../../'], { relativeTo: this.route });
      }
    });
  }

  onCardClick(stockItemId: number) {
    this.router.navigate(['../../'], { relativeTo: this.route, state: { selectedStockItemId: stockItemId } });
  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }
}
