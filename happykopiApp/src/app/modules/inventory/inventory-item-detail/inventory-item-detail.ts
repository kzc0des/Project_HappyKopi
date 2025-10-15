import { Component, OnInit } from '@angular/core';
import { StockItemSummaryDto } from '../../../core/dtos/stockitem/stock-item-summary-dto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inventory-item-detail',
  imports: [],
  templateUrl: './inventory-item-detail.html',
  styleUrl: './inventory-item-detail.css'
})
export class InventoryItemDetail implements OnInit {
  stockitemsummaries: StockItemSummaryDto[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.stockitemsummaries = this.route.snapshot.data['stockitemlist'];
    console.log('Data from resolver:', this.stockitemsummaries);
  }

}
