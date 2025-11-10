import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductsWithCategoryDto } from '../../../../core/dtos/order/products-with-category.dto';

@Component({
  selector: 'app-order-card',
  imports: [],
  templateUrl: './order-card.html',
  styleUrl: './order-card.css',
})
export class OrderCard {
  @Input() orderCard!: ProductsWithCategoryDto;
  @Output() cardClick = new EventEmitter<ProductsWithCategoryDto>();

  get drinkImage(): string | null {
    return this.orderCard.imageUrl || null;
  }

  onClick(): void {
    this.cardClick.emit(this.orderCard);
  }
}
