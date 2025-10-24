import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface cartItemDto {
 Name: string,
 Size: string,
 AddOn: string,
 Subtotal: number,
 DrinkQuantity: number,
 AddOnQuantity: number
}

@Component({
  selector: 'app-cart-item',
  imports: [CurrencyPipe],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css'
})
export class CartItem {
@Input() cartItem!: cartItemDto;
}
