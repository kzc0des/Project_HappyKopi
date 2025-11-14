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
  modifierId: number;
}

interface IngredientUsage {
  stockItemId: number;
  stockItemName: string;
  quantityNeeded: number;
  availableStock: number;
  usedInBasket: number;
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
  maxQuantity: number = 999;

  productConfig?: ProductConfigurationResultDto;
  ingredientUsageMap: Map<number, IngredientUsage> = new Map();

  constructor(private orderService: OrderService, private undoRedoService: UndoRedoService) {}

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
        console.log('=== RAW API RESPONSE ===');
        console.log('Config:', config);
        console.log('Ingredients:', config.ingredients);

        if (config.ingredients && config.ingredients.length > 0) {
          console.log('First ingredient:', config.ingredients[0]);
          console.log('Keys:', Object.keys(config.ingredients[0]));
        }

        this.productConfig = config as ProductConfigurationResultDto;

        if (config.variants && config.variants.length > 0) {
          this.sizes = config.variants.map((v: any) => ({
            SizeName: v.sizeName,
            SizeQuantity: v.price,
          }));
          this.activeSize = this.sizes[0].SizeName;
          this.selectedVariantId = config.variants[0].id;

          this.loadAddonsForVariant(this.selectedVariantId);
          this.calculateMaxQuantity();
        }
      },
      error: (err) => console.error('API Error:', err),
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
        modifierId: addon.id,
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
      this.calculateMaxQuantity();

      if (this.quantity > this.maxQuantity) {
        this.quantity = this.maxQuantity;
      }
    }
  }

  calculateMaxQuantity() {
    if (!this.productConfig) {
      console.warn('No product config available');
      return;
    }

    const variantIngredients = this.productConfig.ingredients.filter(
      (ing) => ing.productVariantId === this.selectedVariantId
    );

    console.log('=== CALCULATING MAX QUANTITY ===');
    console.log('Variant ingredients:', variantIngredients);

    if (variantIngredients.length === 0) {
      console.warn('No ingredients found for variant, setting max to 999');
      this.maxQuantity = 999;
      return;
    }

    // Check if any ingredient is missing availableStock
    const missingStock = variantIngredients.some(
      (ing) => ing.availableStock === undefined || ing.availableStock === null
    );

    if (missingStock) {
      console.error('ERROR: Some ingredients are missing availableStock data!');
      console.error(
        'Ingredients:',
        variantIngredients.map((i) => ({
          name: i.stockItemName,
          id: i.stockItemId,
          availableStock: i.availableStock,
        }))
      );
      this.maxQuantity = 0; // Set to 0 to prevent orders when stock data is missing
      alert('Unable to load stock information. Please refresh the page.');
      return;
    }

    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const usedIngredients = new Map<number, number>();

    existingOrders.forEach((order) => {
      const orderIngredients = this.productConfig!.ingredients.filter(
        (ing) => ing.productVariantId === order.productVariantId
      );

      orderIngredients.forEach((ing) => {
        const totalUsed = ing.quantityNeeded * order.quantity;
        const current = usedIngredients.get(ing.stockItemId) || 0;
        usedIngredients.set(ing.stockItemId, current + totalUsed);
      });
    });

    // For each ingredient in current variant, calculate max possible quantity
    let minMaxQuantity = 999;

    variantIngredients.forEach((ing) => {
      const alreadyUsed = usedIngredients.get(ing.stockItemId) || 0;
      const remainingStock = ing.availableStock - alreadyUsed;
      const maxForThisIngredient = Math.floor(remainingStock / ing.quantityNeeded);

      console.log(`Ingredient: ${ing.stockItemName}`);
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
    console.log(`FINAL Max quantity for this drink: ${this.maxQuantity}`);
    console.log('================================');
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

  addToOrder() {
    if (this.quantity > this.maxQuantity) {
      alert(`Cannot add more than ${this.maxQuantity} drinks`);
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

    // Try to find a matching order
    const matchingOrder = existingOrders.find((order) => {
      // Same drink & variant
      if (
        order.drinkID !== this.addOrderModal?.ProductId ||
        order.productVariantId !== this.selectedVariantId
      ) {
        return false;
      }

      // Same number of addons
      if (order.addons.length !== selectedAddons.length) return false;

      // Compare addons by modifierId and quantity, ignoring order
      const sortedExisting = [...order.addons].sort((a, b) => a.modifierId - b.modifierId);
      const sortedNew = [...selectedAddons].sort((a, b) => a.modifierId - b.modifierId);

      return sortedExisting.every(
        (addon, idx) =>
          addon.modifierId === sortedNew[idx].modifierId &&
          addon.quantity === sortedNew[idx].quantity
      );
    });

    if (matchingOrder) {
      // Increment quantity of existing order
      matchingOrder.quantity += this.quantity;
      matchingOrder.total += this.getTotal();
      matchingOrder.sizePrice = this.sizePrice; // optional, keep latest size price
    } else {
      // Create a new order item
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

      let lastID = orderItem.tempOrderID + 1;
      localStorage.setItem('lastOrderID', lastID.toString());
    }

    localStorage.setItem('orders', JSON.stringify(existingOrders)); 
    window.dispatchEvent(new CustomEvent('ordersUpdated'));

    this.closeModal.emit();
  }
}
