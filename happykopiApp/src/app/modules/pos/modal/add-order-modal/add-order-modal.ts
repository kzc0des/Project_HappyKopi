import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AddonCardActive,
  addonCardDto,
} from '../../components/addon-card-active/addon-card-active';
import { OrderQuantityModifier } from '../../components/order-quantity-modifier/order-quantity-modifier';
import { GrandeActive, sizeButtonDto } from '../../components/grande-active/grande-active';
import { LongYellowButton } from '../../../../shared/components/long-yellow-button/long-yellow-button';
import { CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Addon, OrderItem } from '../../../../core/dtos/order/order-item.dto';
import { ProductConfigurationResultDto } from '../../../../core/dtos/order/product-configuration-result.dto';
import { OrderVariantAddOnDto } from '../../../../core/dtos/order/order-variant-addon.dto';
import { AllAvailableAddonDto } from '../../../../core/dtos/order/all-available-addon.dto';
import { UndoRedoService } from '../services/undo-redo';

export interface addOrderModalDto {
  ProductId: number;
  DrinkName: string;
  DrinkCategory: string;
  BasePrice: number;
  ImageUrl?: string;
}

interface AddonWithConfig extends addonCardDto {
  minQuantity: number;
  modifierId: number; // Added modifierId to track the addon ID
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
  addons: AddonWithConfig[] = [];
  activeSize: string = '';
  selectedVariantId: number = 0;
  quantity: number = 1;

  productConfig?: ProductConfigurationResultDto;

  constructor(private orderService: OrderService, private undoRedoService: UndoRedoService) {}

  ngOnInit() {
    this.addOrderModal = {
      ProductId: this.addOrderModal?.ProductId ?? 0,
      DrinkName: this.addOrderModal?.DrinkName ?? 'Drink Name',
      DrinkCategory: this.addOrderModal?.DrinkCategory ?? 'Drink Category',
      BasePrice: this.addOrderModal?.BasePrice ?? 0,
      ImageUrl: this.addOrderModal?.ImageUrl || '', // ✅ Add this
    };

    if (this.addOrderModal.ProductId) {
      this.loadProductConfiguration();
    }
  }

  loadProductConfiguration() {
    this.orderService.getProductConfiguration(this.addOrderModal!.ProductId).subscribe({
      next: (config: ProductConfigurationResultDto) => {
        console.log('Product Configuration:', config);
        this.productConfig = config;

        if (config.variants && config.variants.length > 0) {
          this.sizes = config.variants.map((v) => ({
            SizeName: v.sizeName,
            SizeQuantity: v.price,
          }));
          this.activeSize = this.sizes[0].SizeName;
          this.selectedVariantId = config.variants[0].id;

          this.loadAddonsForVariant(this.selectedVariantId);
        } else {
          console.warn('No variants with ingredients found for this product');
        }
      },
      error: (err) => {
        console.error('Error loading product configuration:', err);
      },
    });
  }

  loadAddonsForVariant(variantId: number) {
    if (!this.productConfig) return;

    const variantAddons = this.productConfig.addOns.filter((a) => a.productVariantId === variantId);

    const defaultQuantities = new Map<number, number>();
    variantAddons.forEach((va) => {
      defaultQuantities.set(va.modifierId, va.defaultQuantity);
    });

    this.addons = this.productConfig.allAvailableAddons.map((addon) => {
      const defaultQty = defaultQuantities.get(addon.id) || 0;
      return {
        Name: addon.name,
        Quantity: defaultQty,
        Price: addon.price,
        minQuantity: defaultQty,
        modifierId: addon.id, // Store the addon ID
      };
    });

    console.log('Loaded addons for variant:', variantId, this.addons);
  }

  selectSize(size: sizeButtonDto) {
    this.activeSize = size.SizeName;

    const variant = this.productConfig?.variants.find((v) => v.sizeName === size.SizeName);
    if (variant) {
      this.selectedVariantId = variant.id;
      this.loadAddonsForVariant(variant.id);
    }
  }

  onQuantityChange(newQuantity: number) {
    this.quantity = newQuantity;
  }

  onAddonQuantityChange(addonName: string, newQuantity: number) {
    const addon = this.addons.find((a) => a.Name === addonName);
    if (addon) {
      if (newQuantity < addon.minQuantity) {
        console.warn(`Cannot decrease ${addonName} below ${addon.minQuantity}`);
        addon.Quantity = addon.minQuantity;
        return;
      }
      addon.Quantity = newQuantity;
    }
  }

  get sizePrice(): number {
    const selectedSize = this.sizes.find((s) => s.SizeName === this.activeSize);
    return selectedSize?.SizeQuantity ?? 0;
  }

  getTotal(): number {
    const addonsTotal = this.addons
      .filter((a) => a.Quantity > 0)
      .reduce((sum, a) => sum + (a.Price ?? 0) * a.Quantity, 0);

    return (this.sizePrice + addonsTotal) * this.quantity;
  }

  addToOrder() {
    const selectedAddons: Addon[] = this.addons
      .filter((a) => a.Quantity > 0)
      .map((a) => ({
        name: a.Name,
        quantity: a.Quantity,
        price: a.Price ?? 0,
        modifierId: a.modifierId,
      }));

    const variantIngredients =
      this.productConfig?.ingredients.filter(
        (ing) => ing.productVariantId === this.selectedVariantId
      ) || [];

    const newOrder = {
      productId: this.addOrderModal?.ProductId,
      productVariantId: this.selectedVariantId,
      drinkName: this.addOrderModal?.DrinkName ?? '',
      drinkCategory: this.addOrderModal?.DrinkCategory ?? '',
      imageUrl: this.addOrderModal?.ImageUrl || '',
      size: this.activeSize,
      sizePrice: this.sizePrice,
      quantity: this.quantity,
      addons: selectedAddons,
      ingredients: variantIngredients.map((ing) => ({
        stockItemId: ing.stockItemId,
        stockItemName: ing.stockItemName,
        quantityNeeded: ing.quantityNeeded,
        totalQuantityNeeded: ing.quantityNeeded * this.quantity,
      })),
      subtotal: this.getTotal() / this.quantity,
      total: this.getTotal(),
      timestamp: new Date().toISOString(),
    };

    console.log('=== ORDER PAYLOAD ===');
    console.log(JSON.stringify(newOrder, null, 2));
    console.log('===================');

    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');

    const orderItem: OrderItem = {
      tempOrderID: Number(localStorage.getItem('lastOrderID') || '0'),
      drinkID: newOrder.productId,
      drinkName: newOrder.drinkName,
      drinkCategory: newOrder.drinkCategory,
      imageUrl: newOrder.imageUrl,
      size: newOrder.size,
      quantity: newOrder.quantity,
      total: newOrder.total,
      addons: newOrder.addons,
      productVariantId: newOrder.productVariantId,
      sizePrice: newOrder.sizePrice,
    };

    existingOrders.push(orderItem);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    let lastID = orderItem.tempOrderID + 1;
    localStorage.setItem('lastOrderID', lastID.toString());

    this.undoRedoService.saveAddedOrder(orderItem);
 
    window.dispatchEvent(new CustomEvent('ordersUpdated'));

    this.closeModal.emit();
  }
}
