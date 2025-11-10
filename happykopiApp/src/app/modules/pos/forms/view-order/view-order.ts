import { Component, OnInit } from '@angular/core';
import { CartItem, cartItemDto } from '../../components/cart-item/cart-item';
import { LongYellowButton } from '../../../../shared/components/long-yellow-button/long-yellow-button';
import { CommonModule } from '@angular/common';
import { OrderItem } from '../../../../core/dtos/order/order-item.dto'; 
import { EditOrderModal } from '../../modal/edit-order-modal/edit-order-modal';

@Component({
  selector: 'app-view-order',
  imports: [CartItem, LongYellowButton, CommonModule, EditOrderModal],
  templateUrl: './view-order.html',
  styleUrl: './view-order.css',
})
export class ViewOrder implements OnInit {
  orders: cartItemDto[] = [];
  showEditModal = false;
  selectedOrderId: number | null = null;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const storedOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');

    this.orders = storedOrders.map((order) => ({
      tempOrderID: order.tempOrderID,
      Name: order.drinkName,
      Size: order.size,
      DrinkImage: '',
      Addons: order.addons.map((a) => ({ name: a.name, quantity: a.quantity })),
      Subtotal: order.total,
      DrinkQuantity: order.quantity,
    }));
  }

  openEditModal(orderId: number) {
    this.selectedOrderId = orderId;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedOrderId = null;
    this.loadOrders(); // refresh orders after edit
  }

  clearOrders() {
    localStorage.removeItem('orders');
    this.orders = [];
  }
}
