import { Component, Input, OnInit } from '@angular/core';
import { CartItem, cartItemDto } from '../../components/cart-item/cart-item';
import { LongYellowButton } from '../../../../shared/components/long-yellow-button/long-yellow-button';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { OrderItem } from '../../../../core/dtos/order/order-item.dto';
import { EditOrderModal } from '../../modal/edit-order-modal/edit-order-modal';
import { OrderService } from '../../services/order.service';
import {
  NewOrderRequestDto,
  NewOrderItemDto,
  NewOrderModifierDto,
} from '../../../../core/dtos/order/new-order-request.dto';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UserDto } from '../../../../core/dtos/auth/user-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-order',
  imports: [CartItem, LongYellowButton, CommonModule, EditOrderModal, CurrencyPipe],
  templateUrl: './view-order.html',
  styleUrl: './view-order.css',
})
export class ViewOrder implements OnInit {
  total: number = 0;
  orders: cartItemDto[] = [];
  showEditModal = false;
  selectedOrderId: number | null = null;
  selectedMergedOrder: cartItemDto | null = null;
  isProcessing = false;

  currentUser: UserDto | null = null;
  currentUserId: number | null = null;
  currentBaristaName: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadOrders();

    // Listen for orders updated event
    window.addEventListener('ordersUpdated', () => {
      this.loadOrders();
    });
  }

  private loadCurrentUser() {
    this.authService.getCurrentUser$().subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.currentUserId = Array.isArray(user.id) ? user.id[0] : user.id;
        this.currentBaristaName = user.username;
        console.log('✅ Current User Loaded:', this.currentUser);
      } else {
        console.warn('⚠ No logged-in user found!');
      }
    });
  }

  loadOrders() {
    const storedOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');

    // FIXED: Clean the orders by removing addons with quantity 0
    const cleanedOrders = storedOrders.map((order) => ({
      ...order,
      addons: order.addons.filter((addon) => addon.quantity > 0), // Remove zero quantity addons
    }));

    const mergedOrders: cartItemDto[] = [];

    cleanedOrders.forEach((order) => {
      const existingIndex = mergedOrders.findIndex(
        (o) =>
          o.Name === order.drinkName &&
          o.Size === order.size &&
          this.areAddonsEqual(
            o.Addons,
            order.addons.map((a) => ({ name: a.name, quantity: a.quantity }))
          )
      );

      const addonsMapped = order.addons.map((a) => ({ name: a.name, quantity: a.quantity }));

      if (existingIndex >= 0) {
        // Merge quantities and subtotals
        mergedOrders[existingIndex].DrinkQuantity += order.quantity;
        mergedOrders[existingIndex].Subtotal += order.total;
      } else {
        mergedOrders.push({
          tempOrderID: order.tempOrderID, // Keep original ID
          Name: order.drinkName,
          Size: order.size,
          DrinkImage: order.imageUrl || '',
          Addons: addonsMapped,
          Subtotal: order.total,
          DrinkQuantity: order.quantity,
        });
      }
    });

    this.orders = mergedOrders;
    this.calculateTotal();

    // FIXED: Update localStorage with cleaned orders (optional)
    localStorage.setItem('orders', JSON.stringify(cleanedOrders));
  }

  calculateTotal() {
    this.total = this.orders.reduce((sum, order) => sum + order.Subtotal, 0);
  }

  openEditModal(mergedOrderId: number) {
    // Find the merged order that's being edited
    const mergedOrder = this.orders.find((order) => order.tempOrderID === mergedOrderId);

    if (mergedOrder) {
      this.selectedMergedOrder = mergedOrder;
      this.selectedOrderId = mergedOrderId;
      this.showEditModal = true;
    }
  }

  private areAddonsEqual(
    a: { name: string; quantity: number }[],
    b: { name: string; quantity: number }[]
  ): boolean {
    // Since we already filtered out zero quantity addons, we can do direct comparison
    if (a.length !== b.length) return false;

    const sortedA = [...a].sort((x, y) => x.name.localeCompare(y.name));
    const sortedB = [...b].sort((x, y) => x.name.localeCompare(y.name));

    return sortedA.every(
      (addon, index) =>
        addon.name === sortedB[index].name && addon.quantity === sortedB[index].quantity
    );
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedOrderId = null;
    this.selectedMergedOrder = null;
    this.loadOrders();
  }

  chargeWithCash() {
    if (this.orders.length === 0 || this.isProcessing) return;
    this.processOrder('Cash');
  }

  chargeWithGCash() {
    if (this.orders.length === 0 || this.isProcessing) return;
    this.processOrder('GCash');
  }

  private processOrder(paymentType: 'Cash' | 'GCash') {
    if (!this.currentUserId) {
      alert('No logged-in user detected. Please log in first.');
      return;
    }

    this.isProcessing = true;
    console.log('Payment Type:', paymentType);

    const storedOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');

    const orderItems: NewOrderItemDto[] = storedOrders.map((order) => {
      const modifiers: NewOrderModifierDto[] = order.addons.map((addon) => ({
        modifierId: addon.modifierId,
        quantity: addon.quantity,
        price: addon.price,
        subtotal: addon.price * addon.quantity,
      }));

      return {
        productVariantId: order.productVariantId,
        quantity: order.quantity,
        price: order.sizePrice,
        subtotal: order.total,
        modifiers: modifiers,
      };
    });

    const totalAmount = storedOrders.reduce((sum, order) => sum + order.total, 0);

    const orderRequest: NewOrderRequestDto = {
      userId: this.currentUserId,
      totalAmount: totalAmount,
      status: 'Completed',
      paymentType: paymentType,
      amountPaid: totalAmount,
      change: 0,
      referenceNumber:
        paymentType === 'GCash'
          ? `GCASH-${Date.now()}-${Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, '0')}`
          : null,
      orderItems: orderItems,
    };

    console.log(JSON.stringify(orderRequest, null, 2));

    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        console.log('\n✅ ORDER SUCCESS:', response);

        const receiptData = {
          orderNumber: response.orderNumber,
          baristaName: this.currentBaristaName,
          paymentType: paymentType,
          referenceNumber: orderRequest.referenceNumber,
          totalAmount: totalAmount,
          orders: storedOrders,
          timestamp: new Date().toISOString(),
        };

        localStorage.setItem('lastReceipt', JSON.stringify(receiptData));

        this.router.navigate(['/app/orders/summary']);

        this.isProcessing = false;
      },
      error: (error) => {
        alert('Failed to create order: ' + (error.error?.message || error.message));
        this.isProcessing = false;
      },
    });
  }

  clearOrders() {
    localStorage.removeItem('orders');
    this.orders = [];
    this.total = 0;
  }
}
