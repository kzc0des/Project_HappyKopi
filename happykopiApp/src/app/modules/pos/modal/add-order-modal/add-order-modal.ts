import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AddonCardActive,
  addonCardDto,
} from '../../components/addon-card-active/addon-card-active';
import { OrderQuantityModifier } from '../../components/order-quantity-modifier/order-quantity-modifier';
import { GrandeActive } from '../../components/grande-active/grande-active';
import { LongYellowButton } from '../../../../shared/components/long-yellow-button/long-yellow-button';
import { CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Addon, OrderItem } from '../../../../core/dtos/order/order-item.dto';
import { ProductConfigurationResultDto } from '../../../../core/dtos/order/product-configuration-result.dto';

export interface addOrderModalDto {
  ProductId: number;
  DrinkName: string;
  DrinkCategory: string;
  BasePrice: number;
  ImageUrl?: string;
}

interface AddonWithConfig extends addonCardDto {
  minQuantity: number;
  modifierId: number;
}

interface IngredientUsage {
  stockItemId: number;
  stockItemName: string;
  quantityNeeded: number;
  availableStock: number;
  usedInBasket: number;
}

interface SizeWithAvailability {
  SizeName: string;
  SizeQuantity: number;
  isAvailable: boolean;
  maxQuantityForSize: number;
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

  sizes: SizeWithAvailability[] = [];
  addons: AddonWithConfig[] = [];
  activeSize: string = '';
  selectedVariantId: number = 0;
  quantity: number = 1;
  maxQuantity: number = 999;

  productConfig?: ProductConfigurationResultDto;
  ingredientUsageMap: Map<number, IngredientUsage> = new Map();

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.addOrderModal = {
      ProductId: this.addOrderModal?.ProductId ?? 0,
      DrinkName: this.addOrderModal?.DrinkName ?? 'Drink Name',
      DrinkCategory: this.addOrderModal?.DrinkCategory ?? 'Drink Category',
      BasePrice: this.addOrderModal?.BasePrice ?? 0,
      ImageUrl: this.addOrderModal?.ImageUrl || '',
    };

    if (this.addOrderModal.ProductId) {
      this.loadProductConfiguration();
    }
  }

  loadProductConfiguration() {
    this.orderService.getProductConfiguration(this.addOrderModal!.ProductId).subscribe({
      next: (config: any) => {
        this.productConfig = config as ProductConfigurationResultDto;

        if (config.variants && config.variants.length > 0) {
          // Check availability for each size/variant
          this.sizes = config.variants.map((v: any) => {
            const variantId = v.id;
            const sizeAvailability = this.checkVariantAvailability(variantId);

            return {
              SizeName: v.sizeName,
              SizeQuantity: v.price,
              isAvailable: sizeAvailability.isAvailable,
              maxQuantityForSize: sizeAvailability.maxQuantity,
            };
          });

          // Select first AVAILABLE size
          const firstAvailableSize = this.sizes.find((s) => s.isAvailable);
          if (firstAvailableSize) {
            this.activeSize = firstAvailableSize.SizeName;
            const variant = config.variants.find(
              (v: any) => v.sizeName === firstAvailableSize.SizeName
            );
            if (variant) {
              this.selectedVariantId = variant.id;
            }
          } else {
            // No sizes available - close modal
            alert('This product is currently unavailable in all sizes.');
            this.closeModal.emit();
            return;
          }

          this.loadAddonsForVariant(this.selectedVariantId);
          this.updateMaxQuantity();
        }
      },
      error: (err) => console.error('API Error:', err),
    });
  }

  checkVariantAvailability(variantId: number): { isAvailable: boolean; maxQuantity: number } {
    if (!this.productConfig) return { isAvailable: false, maxQuantity: 0 };

    const variantIngredients = this.productConfig.ingredients.filter(
      (ing) => ing.productVariantId === variantId
    );

    if (variantIngredients.length === 0) return { isAvailable: true, maxQuantity: 999 };

    // Calculate used ingredients in basket
    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const usedIngredients = new Map<number, number>();

    existingOrders.forEach((order) => {
      if (!order.drinkID) return;
      const orderIngredients = this.productConfig!.ingredients.filter(
        (ing) => ing.productVariantId === order.productVariantId
      );
      orderIngredients.forEach((ing) => {
        const totalUsed = ing.quantityNeeded * order.quantity;
        const current = usedIngredients.get(ing.stockItemId) || 0;
        usedIngredients.set(ing.stockItemId, current + totalUsed);
      });
    });

    // Check if this variant has enough stock
    const maxPerIngredient = variantIngredients.map((ing) => {
      const alreadyUsed = usedIngredients.get(ing.stockItemId) || 0;
      const remainingStock = ing.availableStock - alreadyUsed;
      return Math.floor(remainingStock / ing.quantityNeeded);
    });

    const maxQuantity = Math.max(0, Math.min(...maxPerIngredient));
    return {
      isAvailable: maxQuantity > 0,
      maxQuantity: maxQuantity,
    };
  }

  loadAddonsForVariant(variantId: number) {
    if (!this.productConfig) return;

    const variantAddons = this.productConfig.addOns.filter((a) => a.productVariantId === variantId);

    const defaultQuantities = new Map<number, number>();
    variantAddons.forEach((va) => defaultQuantities.set(va.modifierId, va.defaultQuantity));

    this.addons = this.productConfig.allAvailableAddons.map((addon) => {
      const defaultQty = defaultQuantities.get(addon.id) || 0;
      return {
        Name: addon.name,
        Quantity: defaultQty,
        Price: addon.price,
        minQuantity: defaultQty,
        modifierId: addon.id,
      };
    });
  }

  selectSize(size: SizeWithAvailability) {
    // Prevent selecting unavailable sizes
    if (!size.isAvailable) {
      alert(`${size.SizeName} is currently unavailable due to insufficient stock.`);
      return;
    }

    this.activeSize = size.SizeName;
    const variant = this.productConfig?.variants.find((v) => v.sizeName === size.SizeName);
    if (variant) {
      this.selectedVariantId = variant.id;
      this.loadAddonsForVariant(variant.id);
      this.updateMaxQuantity();
      if (this.quantity > this.maxQuantity) this.quantity = this.maxQuantity;
    }
  }

  updateMaxQuantity() {
    const variantIngredients = this.productConfig?.ingredients.filter(
      (ing) => ing.productVariantId === this.selectedVariantId
    );

    if (!variantIngredients || variantIngredients.length === 0) {
      this.maxQuantity = 999;
      return;
    }

    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const usedIngredients = new Map<number, number>();

    existingOrders.forEach((order) => {
      const ingList = this.productConfig!.ingredients.filter(
        (ing) => ing.productVariantId === order.productVariantId
      );

      ingList.forEach((ing) => {
        const totalUsed = ing.quantityNeeded * order.quantity;
        const current = usedIngredients.get(ing.stockItemId) || 0;
        usedIngredients.set(ing.stockItemId, current + totalUsed);
      });
    });

    let minMaxQuantity = 999;

    variantIngredients.forEach((ing) => {
      const alreadyUsed = usedIngredients.get(ing.stockItemId) || 0;
      const remainingStock = ing.availableStock - alreadyUsed;
      const maxForThisIngredient = Math.floor(remainingStock / ing.quantityNeeded);

      this.ingredientUsageMap.set(ing.stockItemId, {
        stockItemId: ing.stockItemId,
        stockItemName: ing.stockItemName,
        quantityNeeded: ing.quantityNeeded,
        availableStock: ing.availableStock,
        usedInBasket: alreadyUsed,
      });

      if (maxForThisIngredient < minMaxQuantity) {
        minMaxQuantity = maxForThisIngredient;
      }
    });

    this.maxQuantity = Math.max(0, minMaxQuantity);
  }

  onQuantityChange(newQuantity: number) {
    this.updateMaxQuantity();
    if (newQuantity > this.maxQuantity) {
      this.quantity = this.maxQuantity;
      this.showStockLimitMessage();
    } else this.quantity = newQuantity;
  }

  showStockLimitMessage() {
    let limitingIngredient = '';
    let minMax = 999;

    this.ingredientUsageMap.forEach((usage) => {
      const remaining = usage.availableStock - usage.usedInBasket;
      const maxForThis = Math.floor(remaining / usage.quantityNeeded);

      if (maxForThis < minMax) {
        minMax = maxForThis;
        limitingIngredient = usage.stockItemName;
      }
    });

    alert(`Maximum ${this.maxQuantity} drinks allowed due to limited ${limitingIngredient} stock`);
  }

  onAddonQuantityChange(addonName: string, newQuantity: number) {
    const addon = this.addons.find((a) => a.Name === addonName);
    if (!addon) return;
    addon.Quantity = Math.max(addon.minQuantity, newQuantity);
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
    this.updateMaxQuantity();
    if (this.quantity > this.maxQuantity) {
      alert(`Cannot add ${this.quantity} drinks. Maximum allowed: ${this.maxQuantity}`);
      return;
    }

    const selectedAddons: Addon[] = this.addons
      .filter((a) => a.Quantity > 0)
      .map((a) => ({
        name: a.Name,
        quantity: a.Quantity,
        price: a.Price ?? 0,
        modifierId: a.modifierId,
      }));

    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');

    const orderItem: OrderItem = {
      tempOrderID: Number(localStorage.getItem('lastOrderID') || '0'),
      drinkID: this.addOrderModal?.ProductId,
      drinkName: this.addOrderModal?.DrinkName ?? '',
      drinkCategory: this.addOrderModal?.DrinkCategory ?? '',
      imageUrl: this.addOrderModal?.ImageUrl || '',
      size: this.activeSize,
      sizePrice: this.sizePrice,
      quantity: this.quantity,
      total: this.getTotal(),
      addons: selectedAddons,
      productVariantId: this.selectedVariantId,
    };
    existingOrders.push(orderItem);

    localStorage.setItem('lastOrderID', (orderItem.tempOrderID + 1).toString());
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    window.dispatchEvent(new CustomEvent('ordersUpdated'));

    const event = new CustomEvent('refreshStock');
    window.dispatchEvent(event);

    this.closeModal.emit();
  }
}
