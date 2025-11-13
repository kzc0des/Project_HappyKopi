import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockItemBatchDetailsDto } from '../../../core/dtos/stockitem/stock-item-batch-details-dto';
import { Itemcard } from '../../../shared/components/itemcard/itemcard';
import { DateCard } from '../../../shared/components/date-card/date-card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpiryDateCard } from '../components/expiry-date-card/expiry-date-card';

@Component({
  selector: 'app-inventory-batch-view',
  standalone: true,
  imports: [Itemcard, DateCard, CommonModule, FormsModule, ExpiryDateCard],
  templateUrl: './inventory-batch-view.html',
  styleUrl: './inventory-batch-view.css'
})
export class InventoryBatchView implements OnInit {
  batchDetail!: StockItemBatchDetailsDto;
  unitOfMeasure: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.batchDetail = this.route.snapshot.data['batchdetail'];
    this.unitOfMeasure = this.route.snapshot.data['stockitemdetail']?.unitOfMeasure ?? '';
  }
}
