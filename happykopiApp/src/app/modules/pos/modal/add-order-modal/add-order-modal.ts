import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AddonCardActive,
  addonCardDto,
} from '../../components/addon-card-active/addon-card-active';
import { OrderQuantityModifier } from '../../components/order-quantity-modifier/order-quantity-modifier';
import { GrandeActive, sizeButtonDto } from '../../components/grande-active/grande-active';
import { LongYellowButton } from '../../../../shared/components/long-yellow-button/long-yellow-button';
import { CurrencyPipe } from '@angular/common';
import { OrderModifierSummaryDto } from '../../../../core/dtos/order/order-modifier-summary.to';
import { ModifierType } from '../../../../core/enums/modifier-type';
import { OrderService } from '../../services/order.service';
import { Addon, OrderItem } from '../../../../core/dtos/order/order-item.dto';

export interface addOrderModalDto {
  DrinkName: string;
  DrinkCategory: string;
  BasePrice: number;
}

@Component({
  selector: 'app-add-order-modal',
  imports: [AddonCardActive, OrderQuantityModifier, GrandeActive, LongYellowButton, CurrencyPipe],
  templateUrl: './add-order-modal.html',
  styleUrl: './add-order-modal.css',
})
export class AddOrderModal implements OnInit {
  @Input() addOrderModal?: addOrderModalDto;
  @Output() closeModal = new EventEmitter<void>();

  sizes: sizeButtonDto[] = [];
  addons: addonCardDto[] = [];
  activeSize: string = '';
  quantity: number = 1;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadSizes();
    this.loadAddons();

    this.addOrderModal = {
      DrinkName: this.addOrderModal?.DrinkName ?? 'Drink Name',
      DrinkCategory: this.addOrderModal?.DrinkCategory ?? 'Drink Category',
      BasePrice: this.addOrderModal?.BasePrice ?? 0,
    };
  }

  loadSizes() {
    this.orderService.getModifiersByType(ModifierType.Sizes).subscribe({
      next: (sizes: OrderModifierSummaryDto[]) => {
        this.sizes = sizes.map((s) => ({
          SizeName: s.name,
          SizeQuantity: s.price ?? 0,
        }));
        if (this.sizes.length > 0) this.activeSize = this.sizes[0].SizeName;
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
    if (addon) {
      addon.Quantity = newQuantity;
    }
  }

  get sizePrice(): number {
    const selectedSize = this.sizes.find((s) => s.SizeName === this.activeSize);
    return selectedSize?.SizeQuantity ?? 0;
  }

  getTotal(): number {
    const base = this.addOrderModal?.BasePrice ?? 0;
    const addonsTotal = this.addons
      .filter((a) => a.Quantity > 0)
      .reduce((sum, a) => sum + (a.Price ?? 0) * a.Quantity, 0);

    return (base + this.sizePrice + addonsTotal) * this.quantity;
  }
 
  private areOrdersIdentical(order1: OrderItem, order2: OrderItem): boolean {
    if (
      order1.drinkName !== order2.drinkName ||
      order1.drinkCategory !== order2.drinkCategory ||
      order1.size !== order2.size
    ) {
      return false;
    }
 
    if (order1.addons.length !== order2.addons.length) {
      return false;
    }
 
    const addons1 = [...order1.addons].sort((a, b) => a.name.localeCompare(b.name));
    const addons2 = [...order2.addons].sort((a, b) => a.name.localeCompare(b.name));
 
    for (let i = 0; i < addons1.length; i++) {
      if (
        addons1[i].name !== addons2[i].name ||
        addons1[i].quantity !== addons2[i].quantity
      ) {
        return false;
      }
    }

    return true;
  }

  addToOrder() {
    const selectedAddons: Addon[] = this.addons
      .filter((a) => a.Quantity > 0)
      .map((a) => ({
        name: a.Name,
        quantity: a.Quantity,
        price: a.Price ?? 0,
      }));

    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
 
    const newOrder: OrderItem = {
      tempOrderID: 0, 
      drinkName: this.addOrderModal?.DrinkName ?? '',
      drinkCategory: this.addOrderModal?.DrinkCategory ?? '',
      size: this.activeSize,
      quantity: this.quantity,
      total: this.getTotal(),
      addons: selectedAddons,
    };
 
    const matchingOrderIndex = existingOrders.findIndex((order) =>
      this.areOrdersIdentical(order, newOrder)
    );

    if (matchingOrderIndex !== -1) { 
      const existingOrder = existingOrders[matchingOrderIndex];
      const newQuantity = existingOrder.quantity + this.quantity;
       
      const pricePerItem = existingOrder.total / existingOrder.quantity;
      
      existingOrders[matchingOrderIndex] = {
        ...existingOrder,
        quantity: newQuantity,
        total: pricePerItem * newQuantity,
      };

      console.log('Order merged with existing order:', existingOrders[matchingOrderIndex]);
    } else { 
      let lastID = Number(localStorage.getItem('lastOrderID') || '0');
      newOrder.tempOrderID = lastID;
      
      existingOrders.push(newOrder);
      
      lastID += 1;
      localStorage.setItem('lastOrderID', lastID.toString());

      console.log('New order added:', newOrder);
    }

    localStorage.setItem('orders', JSON.stringify(existingOrders));
    this.closeModal.emit();
  }
}