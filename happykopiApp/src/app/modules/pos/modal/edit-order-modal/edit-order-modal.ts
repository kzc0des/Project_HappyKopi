import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AddonCardActive,
  addonCardDto,
} from '../../components/addon-card-active/addon-card-active';
import { OrderQuantityModifier } from '../../components/order-quantity-modifier/order-quantity-modifier';
import { GrandeActive } from '../../components/grande-active/grande-active';
import { LongYellowButton } from '../../../../shared/components/long-yellow-button/long-yellow-button';
import { RedButton } from '../../../../shared/components/red-button/red-button';
import { CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Addon, OrderItem } from '../../../../core/dtos/order/order-item.dto';
import { ProductConfigurationResultDto } from '../../../../core/dtos/order/product-configuration-result.dto';

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
  selector: 'app-edit-order-modal',
  imports: [
    AddonCardActive,
    OrderQuantityModifier,
    GrandeActive,
    LongYellowButton,
    RedButton,
    CurrencyPipe,
  ],
  templateUrl: './edit-order-modal.html',
  styleUrl: './edit-order-modal.css',
})
export class EditOrderModal implements OnInit {
  @Input() orderId!: number;
  @Output() closeModal = new EventEmitter<void>();

  sizes: SizeWithAvailability[] = [];
  addons: AddonWithConfig[] = [];
  activeSize: string = '';
  selectedVariantId: number = 0;
  quantity: number = 1;
  maxQuantity: number = 999;
  orderData?: OrderItem;
  productConfig?: ProductConfigurationResultDto;
  ingredientUsageMap: Map<number, IngredientUsage> = new Map();

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrderData();
  }

  loadOrderData() {
    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
    this.orderData = existingOrders.find((o) => o.tempOrderID === this.orderId);

    if (this.orderData) {
      this.activeSize = this.orderData.size;
      this.quantity = this.orderData.quantity;

      if (this.orderData.drinkID) {
        this.loadProductConfiguration(this.orderData.drinkID);
      }
    }
  }

  loadProductConfiguration(productId: number) {
    this.orderService.getProductConfiguration(productId).subscribe({
      next: (config: ProductConfigurationResultDto) => {
        console.log('Product Configuration:', config);
        this.productConfig = config;

        if (config.variants && config.variants.length > 0) {
          // Check availability for each size
          this.sizes = config.variants.map((v) => {
            const sizeAvailability = this.checkVariantAvailability(v.id);
            
            return {
              SizeName: v.sizeName,
              SizeQuantity: v.price,
              isAvailable: sizeAvailability.isAvailable,
              maxQuantityForSize: sizeAvailability.maxQuantity
            };
          });

          const savedVariant = config.variants.find((v) => v.sizeName === this.orderData!.size);
          if (savedVariant) {
            this.selectedVariantId = savedVariant.id;
          } else {
            this.selectedVariantId = config.variants[0].id;
          }

          this.loadAddonsForVariant(this.selectedVariantId);
          this.calculateMaxQuantity();
        } else {
          console.warn('No variants with ingredients found for this product');
        }
      },
      error: (err) => {
        console.error('Error loading product configuration:', err);
      },
    });
  }

  checkVariantAvailability(variantId: number): { isAvailable: boolean; maxQuantity: number } {
    if (!this.productConfig) return { isAvailable: false, maxQuantity: 0 };

    const variantIngredients = this.productConfig.ingredients.filter(
      (ing) => ing.productVariantId === variantId
    );

    if (variantIngredients.length === 0) return { isAvailable: true, maxQuantity: 999 };

    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const usedIngredients = new Map<number, number>();

    existingOrders.forEach((order) => {
      // Skip current order being edited
      if (order.tempOrderID === this.orderId) return;

      const orderIngredients = this.productConfig!.ingredients.filter(
        (ing) => ing.productVariantId === order.productVariantId
      );
      orderIngredients.forEach((ing) => {
        const totalUsed = ing.quantityNeeded * order.quantity;
        const current = usedIngredients.get(ing.stockItemId) || 0;
        usedIngredients.set(ing.stockItemId, current + totalUsed);
      });
    });

    const maxPerIngredient = variantIngredients.map((ing) => {
      const alreadyUsed = usedIngredients.get(ing.stockItemId) || 0;
      const remainingStock = ing.availableStock - alreadyUsed;
      return Math.floor(remainingStock / ing.quantityNeeded);
    });

    const maxQuantity = Math.max(0, Math.min(...maxPerIngredient));
    return {
      isAvailable: maxQuantity > 0,
      maxQuantity: maxQuantity
    };
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

      const savedAddon = this.orderData?.addons.find((a) => a.name === addon.name);
      const quantity = savedAddon ? savedAddon.quantity : defaultQty;

      return {
        Name: addon.name,
        Quantity: quantity,
        Price: addon.price,
        minQuantity: defaultQty,
        modifierId: addon.id,
      };
    });

    console.log('Loaded addons for variant:', variantId, this.addons);
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
      this.calculateMaxQuantity();

      if (this.quantity > this.maxQuantity) {
        this.quantity = this.maxQuantity;
      }
    }
  }

  calculateMaxQuantity() {
    if (!this.productConfig) return;

    const variantIngredients = this.productConfig.ingredients.filter(
      (ing) => ing.productVariantId === this.selectedVariantId
    );

    if (variantIngredients.length === 0) {
      this.maxQuantity = 999;
      return;
    }

    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const usedIngredients = new Map<number, number>();

    existingOrders.forEach((order) => {
      if (order.tempOrderID === this.orderId) return;

      const orderIngredients = this.productConfig!.ingredients.filter(
        (ing) => ing.productVariantId === order.productVariantId
      );

      orderIngredients.forEach((ing) => {
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

      const ingredientType = ing.isModifierIngredient ? 'MODIFIER' : 'BASE';
      console.log(`[${ingredientType}] ${ing.stockItemName}`);
      console.log(
        `  Available: ${ing.availableStock}, Used: ${alreadyUsed}, Remaining: ${remainingStock}`
      );
      console.log(`  Needed per drink: ${ing.quantityNeeded}, Max drinks: ${maxForThisIngredient}`);

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
    console.log(`Max quantity for this drink: ${this.maxQuantity}`);
  }

  onQuantityChange(newQuantity: number) {
    if (newQuantity > this.maxQuantity) {
      console.warn(`Cannot increase beyond ${this.maxQuantity} - insufficient stock`);
      this.quantity = this.maxQuantity;
      this.showStockLimitMessage();
      return;
    }

    this.quantity = newQuantity;
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

  saveChanges() {
    if (this.quantity > this.maxQuantity) {
      alert(`Cannot save more than ${this.maxQuantity} drinks`);
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

    const variantIngredients =
      this.productConfig?.ingredients.filter(
        (ing) => ing.productVariantId === this.selectedVariantId
      ) || [];

    const updatedOrder = {
      productId: this.orderData?.drinkID,
      productVariantId: this.selectedVariantId,
      drinkName: this.orderData?.drinkName ?? '',
      drinkCategory: this.orderData?.drinkCategory ?? '',
      imageUrl: this.orderData?.imageUrl || '',
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

    console.log('=== UPDATED ORDER PAYLOAD ===');
    console.log(JSON.stringify(updatedOrder, null, 2));
    console.log('============================');

    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const index = existingOrders.findIndex((o) => o.tempOrderID === this.orderId);

    if (index !== -1) {
      existingOrders[index] = {
        ...existingOrders[index],
        drinkName: updatedOrder.drinkName,
        drinkCategory: updatedOrder.drinkCategory,
        imageUrl: updatedOrder.imageUrl,
        size: this.activeSize,
        quantity: this.quantity,
        addons: selectedAddons,
        productVariantId: this.selectedVariantId,
        sizePrice: this.sizePrice,
        total: this.getTotal(),
      };

      localStorage.setItem('orders', JSON.stringify(existingOrders));
      console.log('Order updated:', existingOrders[index]);

      window.dispatchEvent(new CustomEvent('ordersUpdated'));
    }

    this.closeModal.emit();
  }

  delete() {
    let existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders = existingOrders.filter((o) => o.tempOrderID !== this.orderId);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    console.log('Order deleted:', this.orderId);

    window.dispatchEvent(new CustomEvent('ordersUpdated'));
    this.closeModal.emit();
  }
}