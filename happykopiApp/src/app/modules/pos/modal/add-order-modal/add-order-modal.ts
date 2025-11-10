import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AddonCardActive, addonCardDto } from '../../components/addon-card-active/addon-card-active';
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
 
  addToOrder() {
    const selectedAddons: Addon[] = this.addons
      .filter((a) => a.Quantity > 0)
      .map((a) => ({
        name: a.Name,
        quantity: a.Quantity,
        price: a.Price ?? 0,
      }));

    const orderItem: OrderItem = {
      drinkName: this.addOrderModal?.DrinkName ?? '',
      drinkCategory: this.addOrderModal?.DrinkCategory ?? '',
      size: this.activeSize,
      quantity: this.quantity,
      total: this.getTotal(),
      addons: selectedAddons,
    };


    // MAHALAGANG BAGAY 
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(orderItem);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    // MAHALAGANG BAGAY

    console.log('Order added:', orderItem);

    this.closeModal.emit();
  }
}
