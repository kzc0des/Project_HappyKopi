import { Component, Input } from '@angular/core';
import { StockItemBatchDetailsDto } from '../../../../core/dtos/stockitem/stock-item-batch-details-dto';
import { DatePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-ingredient-batch-card',
  imports: [DatePipe],
  templateUrl: './ingredient-batch-card.html',
  styleUrl: './ingredient-batch-card.css'
})
export class IngredientBatchCard {
  @Input() batches: StockItemBatchDetailsDto[] = [];
  @Input() unit!: string;
}
