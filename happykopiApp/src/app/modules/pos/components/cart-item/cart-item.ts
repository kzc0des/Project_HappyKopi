import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CartAddonDto } from '../../../../core/dtos/order/cart-addon.dto';
import { CommonModule } from '@angular/common';

  export interface cartItemDto {
    Name: string;
    Size: string;
    DrinkImage: string;
    Addons: CartAddonDto[];
    Subtotal: number;
    DrinkQuantity: number; 
  }

@Component({
  selector: 'app-cart-item',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css',
})
export class CartItem {
  @Input() cartItem!: cartItemDto;
}
