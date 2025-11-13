import { Component, OnInit } from '@angular/core';
import { Itemcard } from '../../../shared/components/itemcard/itemcard';
import { DateCard } from '../../../shared/components/date-card/date-card';
import { ExpiryDateCard } from '../components/expiry-date-card/expiry-date-card';
import { FormsModule } from '@angular/forms';
import { StockItemBatchForCreateDto } from '../../../core/dtos/stockitem/stock-item-batch-for-create-dto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inventory-batch-add',
  imports: [Itemcard, DateCard, ExpiryDateCard, FormsModule],
  templateUrl: './inventory-batch-add.html',
  styleUrl: './inventory-batch-add.css',
})
export class InventoryBatchAdd implements OnInit {
  batchDetail: Partial<StockItemBatchForCreateDto> = {};
  dateAdded: Date = new Date();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}
}
