// undo-redo.service.ts
import { Injectable } from '@angular/core'; 
import { OrderItem } from '../../../../core/dtos/order/order-item.dto';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {
  private addedOrders: OrderItem[] = []; // Stack of added orders (for undo)
  private removedOrders: OrderItem[] = []; // Stack of removed orders (for redo)

  // Call this when a new order is added
  saveAddedOrder(order: OrderItem): void {
    this.addedOrders.push(JSON.parse(JSON.stringify(order))); // Deep clone
    this.removedOrders = []; // Clear redo stack when new action is performed
    console.log('Order saved for undo. Total undoable actions:', this.addedOrders.length);
  }

  // Undo: Remove the last added order
  undo(): OrderItem | null {
    if (this.addedOrders.length === 0) return null;

    const lastAddedOrder = this.addedOrders.pop();
    if (lastAddedOrder) {
      this.removedOrders.push(lastAddedOrder);
      console.log('Undo performed. Remaining undoable actions:', this.addedOrders.length);
    }
    return lastAddedOrder || null;
  }

  // Redo: Add back the last removed order
  redo(): OrderItem | null {
    if (this.removedOrders.length === 0) return null;

    const lastRemovedOrder = this.removedOrders.pop();
    if (lastRemovedOrder) {
      this.addedOrders.push(lastRemovedOrder);
      console.log('Redo performed. Remaining redoable actions:', this.removedOrders.length);
    }
    return lastRemovedOrder || null;
  }

  canUndo(): boolean {
    return this.addedOrders.length > 0;
  }

  canRedo(): boolean {
    return this.removedOrders.length > 0;
  }

  clearHistory(): void {
    this.addedOrders = [];
    this.removedOrders = [];
  }
}