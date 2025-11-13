// features/order/components/order-card/order-card.ts
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
  @Input() orderCard!: ProductsWithCategoryDto;
  @Input() isUnavailable: boolean = false; // NEW: for unavailable products
  @Output() cardClick = new EventEmitter<ProductsWithCategoryDto>();

  get drinkImage(): string | null {
    return this.orderCard.imageUrl || null;
  }

  onClick(): void {
    this.cardClick.emit(this.orderCard);
  }
}