import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../components/cart-item/cart-item';
import { LongYellowButton } from '../../../../shared/components/long-yellow-button/long-yellow-button';
import { OrderItem } from '../../../../core/dtos/order/order-item.dto';
import { cartItemDto } from '../../components/cart-item/cart-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-order',
  imports: [CartItem, LongYellowButton, CommonModule],
  templateUrl: './view-order.html',
  styleUrl: './view-order.css',
})
export class ViewOrder implements OnInit {
  orders: cartItemDto[] = [];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const storedOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');

    this.orders = storedOrders.map((order) => ({
      Name: order.drinkName,
      Size: order.size,
      DrinkImage: '',
      Addons: order.addons.map((a) => ({ name: a.name, quantity: a.quantity })),
      Subtotal: order.total,
      DrinkQuantity: order.quantity,
    }));
  }

  clearOrders() {
    localStorage.removeItem('orders'); 
    this.orders = [];                  
  }
}
