import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AddonCardActive,
  addonCardDto,
} from '../../components/addon-card-active/addon-card-active';
import { OrderQuantityModifier } from '../../components/order-quantity-modifier/order-quantity-modifier';
import { GrandeActive, sizeButtonDto } from '../../components/grande-active/grande-active';
import { LongYellowButton } from '../../../../shared/components/long-yellow-button/long-yellow-button';
import { RedButton } from '../../../../shared/components/red-button/red-button';
import { CurrencyPipe } from '@angular/common';
import { OrderModifierSummaryDto } from '../../../../core/dtos/order/order-modifier-summary.to';
import { ModifierType } from '../../../../core/enums/modifier-type';
import { OrderService } from '../../services/order.service';
import { Addon, OrderItem } from '../../../../core/dtos/order/order-item.dto';

@Component({
  selector: 'app-edit-order-modal',
  imports: [AddonCardActive, OrderQuantityModifier, GrandeActive, LongYellowButton, RedButton, CurrencyPipe],
  templateUrl: './edit-order-modal.html',
  styleUrl: './edit-order-modal.css',
})
export class EditOrderModal implements OnInit {
  @Input() orderId!: number;
  @Output() closeModal = new EventEmitter<void>();

  sizes: sizeButtonDto[] = [];
  addons: addonCardDto[] = [];
  activeSize: string = '';
  quantity: number = 1;
  orderData?: OrderItem;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadSizes();
    this.loadAddons();
    this.loadOrderData();
  }

  loadOrderData() {
    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
    this.orderData = existingOrders.find((o) => o.tempOrderID === this.orderId);

    if (this.orderData) {
      this.activeSize = this.orderData.size;
      this.quantity = this.orderData.quantity;

      // Match addons from DB with saved quantities
      this.addons.forEach((addon) => {
        const existing = this.orderData!.addons.find((a) => a.name === addon.Name);
        if (existing) addon.Quantity = existing.quantity;
      });
    }
  }

  loadSizes() {
    this.orderService.getModifiersByType(ModifierType.Sizes).subscribe({
      next: (sizes: OrderModifierSummaryDto[]) => {
        this.sizes = sizes.map((s) => ({
          SizeName: s.name,
          SizeQuantity: s.price ?? 0,
        }));
      },
      error: (err) => console.error('Error loading sizes:', err),
    });
  }

  loadAddons() {
    this.orderService.getModifiersByType(ModifierType.AddOns).subscribe({
      next: (addons: OrderModifierSummaryDto[]) => {
        this.addons = addons.map((a) => ({
          Name: a.name,
          Quantity: 0,
          Price: a.price ?? 0,
        }));
        this.loadOrderData(); // reload after addons loaded
      },
      error: (err) => console.error('Error loading addons:', err),
    });
  }

  selectSize(size: sizeButtonDto) {
    this.activeSize = size.SizeName;
  }

  onQuantityChange(newQuantity: number) {
    this.quantity = newQuantity;
  }

  onAddonQuantityChange(addonName: string, newQuantity: number) {
    const addon = this.addons.find((a) => a.Name === addonName);
    if (addon) addon.Quantity = newQuantity;
  }

  get sizePrice(): number {
    const selectedSize = this.sizes.find((s) => s.SizeName === this.activeSize);
    return selectedSize?.SizeQuantity ?? 0;
  }

  getTotal(): number {
    if (!this.orderData) return 0;
 
    const originalSizePrice =
      this.sizes.find((s) => s.SizeName === this.orderData!.size)?.SizeQuantity ?? 0;
    const originalAddonsTotal = this.orderData.addons.reduce(
      (sum, a) => sum + a.price * a.quantity, 0
    );
    const basePrice =
      this.orderData.total / this.orderData.quantity - originalSizePrice - originalAddonsTotal;
 
    const newAddonsTotal = this.addons
      .filter((a) => a.Quantity > 0)
      .reduce((sum, a) => sum + (a.Price ?? 0) * a.Quantity, 0);

    return (basePrice + this.sizePrice + newAddonsTotal) * this.quantity;
  }

  saveChanges() {
    const selectedAddons: Addon[] = this.addons
      .filter((a) => a.Quantity > 0)
      .map((a) => ({
        name: a.Name,
        quantity: a.Quantity,
        price: a.Price ?? 0,
      }));

    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const index = existingOrders.findIndex((o) => o.tempOrderID === this.orderId);

    if (index !== -1) {
      existingOrders[index] = {
        ...existingOrders[index],
        size: this.activeSize,
        quantity: this.quantity,
        addons: selectedAddons,
        total: this.getTotal(),
      };

      localStorage.setItem('orders', JSON.stringify(existingOrders));
      console.log('Order updated:', existingOrders[index]);
    }

    this.closeModal.emit();
  }

  delete() {
    let existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders = existingOrders.filter((o) => o.tempOrderID !== this.orderId);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    console.log('Order deleted:', this.orderId);
    this.closeModal.emit();
  }
}
