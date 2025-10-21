import { Component, OnInit } from '@angular/core';
import { StockItemBatchDetailsDto } from '../../../core/dtos/stockitem/stock-item-batch-details-dto';
import { ActivatedRoute } from '@angular/router';
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { FormsModule } from '@angular/forms';
import { ExpiryDateCard } from "../components/expiry-date-card/expiry-date-card";
import { DateCard } from "../../../shared/components/date-card/date-card";

@Component({
  selector: 'app-inventory-batch-view',
  imports: [Itemcard, FormsModule, ExpiryDateCard, DateCard],
  templateUrl: './inventory-batch-view.html',
  styleUrl: './inventory-batch-view.css'
})
export class InventoryBatchView implements OnInit{
  batchDetail !: StockItemBatchDetailsDto;

  constructor (
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.batchDetail = this.route.snapshot.data['batchdetail'];
  }
}
