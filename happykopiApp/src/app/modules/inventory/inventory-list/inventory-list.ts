import { Component } from '@angular/core';
import { StockItemSummaryDto } from '../../../core/dtos/stockitem/stock-item-summary-dto';
import { ActivatedRoute } from '@angular/router';
import { BatchOrganizerCard } from "../components/batch-organizer-card/batch-organizer-card";

@Component({
  selector: 'app-inventory-list',
  imports: [BatchOrganizerCard],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.css'
})
export class InventoryList {
  stockitemsummaries: StockItemSummaryDto[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.stockitemsummaries = this.route.snapshot.data['stockitemlist'];
    console.log('Data from resolver:', this.stockitemsummaries);
  }
}
