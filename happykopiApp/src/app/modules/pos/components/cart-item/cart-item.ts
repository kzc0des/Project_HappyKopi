import { CurrencyPipe, CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartAddonDto } from '../../../../core/dtos/order/cart-addon.dto';

export interface cartItemDto {
  Name: string;
  Size: string;
  DrinkImage: string;
  Addons: CartAddonDto[];
  Subtotal: number;
  DrinkQuantity: number;
  tempOrderID: number; // ✅ add this
}

@Component({
  selector: 'app-cart-item',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css',
})
export class CartItem {
  @Input() cartItem!: cartItemDto;
  @Output() edit = new EventEmitter<number>();

  editOrder() {
    this.edit.emit(this.cartItem.tempOrderID);
  }
}
