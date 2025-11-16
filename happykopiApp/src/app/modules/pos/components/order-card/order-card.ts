import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsWithCategoryDto } from '../../../../core/dtos/order/products-with-category.dto';

@Component({
  selector: 'app-order-card',
  imports: [CommonModule],
  templateUrl: './order-card.html',
  styleUrl: './order-card.css',
})
export class OrderCard {
  @Input() orderPayload!: ProductsWithCategoryDto;
  @Input() isUnavailable: boolean = false;
  @Output() cardClick = new EventEmitter<number>();

  get drinkImage(): string | null {
    return this.orderPayload.imageUrl || null;
  }

  onClick(): void {
    this.cardClick.emit(this.orderPayload.id);
  }
}