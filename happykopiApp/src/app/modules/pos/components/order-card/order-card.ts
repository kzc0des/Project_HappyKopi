import { Component, Input } from '@angular/core'; 
import { ProductsWithCategoryDto } from '../../../../core/dtos/order/products-with-category.dto';

@Component({
  selector: 'app-order-card',
  imports: [],
  templateUrl: './order-card.html',
  styleUrl: './order-card.css',
})
export class OrderCard {
  @Input() orderCard!: ProductsWithCategoryDto;
 
  get drinkImage(): string | null {
    return this.orderCard.imageUrl || null;
  }
}
