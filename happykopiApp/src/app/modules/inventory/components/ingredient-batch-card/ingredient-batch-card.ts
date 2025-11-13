import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StockItemBatchDetailsDto } from '../../../../core/dtos/stockitem/stock-item-batch-details-dto';
import { DatePipe, JsonPipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { YellowButton } from "../../../../shared/components/yellow-button/yellow-button";

@Component({
  selector: 'app-ingredient-batch-card',
  imports: [DatePipe, RouterLink, YellowButton],
  templateUrl: './ingredient-batch-card.html',
  styleUrl: './ingredient-batch-card.css'
})
export class IngredientBatchCard {
  @Input() batches: StockItemBatchDetailsDto[] = [];
  @Input() unit!: string;
  @Output() addStock = new EventEmitter<void>();
}
