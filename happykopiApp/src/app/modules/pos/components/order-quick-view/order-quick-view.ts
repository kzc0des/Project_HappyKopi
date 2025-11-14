import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { OrderItem } from '../../../../core/dtos/order/order-item.dto';
import { UndoRedoService } from '../../modal/services/undo-redo';

export interface oqvDto {
  OrderNumber: number;
  OrderTotal: number;
  OrderQuantity: number;
}

@Component({
  selector: 'app-order-quick-view',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './order-quick-view.html',
  styleUrl: './order-quick-view.css',
})
export class OrderQuickView implements OnInit, OnDestroy { 
  oqv: oqvDto = {
    OrderNumber: 0,
    OrderTotal: 0,
    OrderQuantity: 0
  };

  expanded = true;
  canUndo = false;
  canRedo = false;
  private storageListener: any;
  private ordersUpdatedListener: any;

  constructor(
    private undoRedoService: UndoRedoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateUndoRedoState();

    // Listen for storage changes
    this.storageListener = () => this.updateUndoRedoState();
    window.addEventListener('storage', this.storageListener);

    // Listen for custom ordersUpdated event
    this.ordersUpdatedListener = () => {
      console.log('Orders updated event received');
      this.updateUndoRedoState();
      this.refreshOQVData();
    };
    window.addEventListener('ordersUpdated', this.ordersUpdatedListener);

    // Initial data load
    this.refreshOQVData();
  }

  ngOnDestroy() {
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
    }
    if (this.ordersUpdatedListener) {
      window.removeEventListener('ordersUpdated', this.ordersUpdatedListener);
    }
  }

  toggleCard() {
    this.expanded = !this.expanded;
  }

  undo() {
    console.log('Undo clicked. Can undo:', this.canUndo);
    const removedOrder = this.undoRedoService.undo();

    if (removedOrder) {
      const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = existingOrders.filter(
        (order) => order.tempOrderID !== removedOrder.tempOrderID
      );

      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      this.refreshOQVData(updatedOrders);
      this.updateUndoRedoState();

      window.dispatchEvent(new CustomEvent('ordersUpdated'));
    }
  }

  redo() {
    console.log('Redo clicked. Can redo:', this.canRedo);
    const addedOrder = this.undoRedoService.redo();

    if (addedOrder) {
      const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');

      const orderExists = existingOrders.some(
        (order) => order.tempOrderID === addedOrder.tempOrderID
      );
      if (!orderExists) {
        existingOrders.push(addedOrder);
        localStorage.setItem('orders', JSON.stringify(existingOrders));
        this.refreshOQVData(existingOrders);
        this.updateUndoRedoState();

        window.dispatchEvent(new CustomEvent('ordersUpdated'));
      }
    }
  }

  viewDrinks() {
    this.router.navigate(['/app/orders/cart']);
  }

  private updateUndoRedoState() {
    this.canUndo = this.undoRedoService.canUndo();
    this.canRedo = this.undoRedoService.canRedo();
    console.log('Undo/Redo state updated - CanUndo:', this.canUndo, 'CanRedo:', this.canRedo);
  }

  private refreshOQVData(orders?: OrderItem[]): void {
    const existingOrders = orders || JSON.parse(localStorage.getItem('orders') || '[]');
    const totalQuantity = existingOrders.reduce(
      (sum: number, order: OrderItem) => sum + order.quantity,
      0
    );
    const totalAmount = existingOrders.reduce(
      (sum: number, order: OrderItem) => sum + order.total,
      0
    );

    this.oqv.OrderQuantity = totalQuantity;
    this.oqv.OrderTotal = totalAmount;

    console.log('OQV Data refreshed - Quantity:', totalQuantity, 'Total:', totalAmount);
  }
}