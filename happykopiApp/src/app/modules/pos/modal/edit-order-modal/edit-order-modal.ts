import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AddonCardActive,
  addonCardDto,
} from '../../components/addon-card-active/addon-card-active';
import { OrderQuantityModifier } from '../../components/order-quantity-modifier/order-quantity-modifier';
import { GrandeActive } from '../../components/grande-active/grande-active';
import { RedButton } from '../../../../shared/components/red-button/red-button';
import { CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Addon, OrderItem } from '../../../../core/dtos/order/order-item.dto';
import { ProductConfigurationResultDto } from '../../../../core/dtos/order/product-configuration-result.dto';
import { YellowButton } from '../../../../shared/components/yellow-button/yellow-button';

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
    RedButton,
    CurrencyPipe,
    YellowButton
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

  // NEW: Track if this is a merged order and its total quantity
  isMergedOrder: boolean = false;
  mergedOrderQuantity: number = 1;

  // NEW: Track original addons to preserve them during size changes
  private originalAddons: Addon[] = [];

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
      this.originalAddons = [...this.orderData.addons]; // Save original addons

      // NEW: Check if this is a merged order and calculate total quantity
      this.checkIfMergedOrder();

      if (this.orderData.drinkID) {
        this.loadProductConfiguration(this.orderData.drinkID);
      } else {
        console.error('No drinkID found for order:', this.orderData);
        // Fallback: Load addons from existing order data
        this.loadAddonsFromOrderData();
      }
    } else {
      console.error('Order not found with ID:', this.orderId);
    }
  }

  // FIXED: Proper fallback that preserves ALL addons with their quantities
  loadAddonsFromOrderData() {
    if (!this.orderData) return;

    // If we already have addons loaded (from product config), preserve them
    if (this.addons.length > 0) {
      console.log('Preserving current addons structure');
      return;
    }

    // If no product config is available, we need to create a basic addon structure
    // This should only happen as a last resort
    console.warn('Using basic addon structure from order data');

    // Create addons from the order data - this is minimal but prevents complete loss
    this.addons = this.orderData.addons.map((addon) => ({
      Name: addon.name,
      Quantity: addon.quantity,
      Price: addon.price,
      minQuantity: 0,
      modifierId: addon.modifierId || 0,
    }));

    console.log('Loaded basic addons from order data:', this.addons);
  }

  // NEW: Check if this order is part of a merged group
  checkIfMergedOrder() {
    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');

    // Find all orders that match this order's characteristics
    const matchingOrders = existingOrders.filter(
      (o) =>
        o.drinkName === this.orderData?.drinkName &&
        o.size === this.orderData?.size &&
        this.areAddonsEqual(o.addons, this.orderData?.addons || [])
    );

    if (matchingOrders.length > 1) {
      this.isMergedOrder = true;
      this.mergedOrderQuantity = matchingOrders.reduce((sum, order) => sum + order.quantity, 0);
      this.quantity = this.mergedOrderQuantity; // Set the quantity to the merged total
    } else {
      this.isMergedOrder = false;
      this.mergedOrderQuantity = this.orderData?.quantity || 1;
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
              maxQuantityForSize: sizeAvailability.maxQuantity,
            };
          });

          const savedVariant = config.variants.find((v) => v.sizeName === this.orderData!.size);
          if (savedVariant) {
            this.selectedVariantId = savedVariant.id;
          } else {
            this.selectedVariantId = config.variants[0].id;
            console.warn('Saved variant not found, using first variant');
          }

          this.loadAddonsForVariant(this.selectedVariantId);
          this.calculateMaxQuantity();
        } else {
          console.warn('No variants with ingredients found for this product');
          this.loadAddonsFromOrderData(); // Fallback
        }
      },
      error: (err) => {
        console.error('Error loading product configuration:', err);
        // FALLBACK: Load addons from existing order data when API fails
        this.loadAddonsFromOrderData();
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
      // Skip current order being edited (and all its merged copies)
      if (
        this.isMergedOrder &&
        order.drinkName === this.orderData?.drinkName &&
        order.size === this.orderData?.size &&
        this.areAddonsEqual(order.addons, this.orderData?.addons || [])
      ) {
        return;
      }

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
      maxQuantity: maxQuantity,
    };
  }

  // FIXED: Completely rewritten to handle addon preservation properly
  loadAddonsForVariant(variantId: number) {
    if (!this.productConfig) {
      console.warn('No product config available, using order data addons');
      this.loadAddonsFromOrderData();
      return;
    }

    const variantAddons = this.productConfig.addOns.filter((a) => a.productVariantId === variantId);

    const defaultQuantities = new Map<number, number>();
    variantAddons.forEach((va) => {
      defaultQuantities.set(va.modifierId, va.defaultQuantity);
    });

    // FIXED: Create a complete map of ALL available addons with proper quantities
    const allAvailableAddons = this.productConfig.allAvailableAddons || [];

    // Create a map of current quantities from the modal (if any)
    const currentModalQuantities = new Map<string, number>();
    this.addons.forEach((addon) => {
      currentModalQuantities.set(addon.Name, addon.Quantity);
    });

    // Create a map of original order quantities
    const originalOrderQuantities = new Map<string, number>();
    this.originalAddons.forEach((addon) => {
      originalOrderQuantities.set(addon.name, addon.quantity);
    });

    // FIXED: Build complete addons list with ALL available addons
    this.addons = allAvailableAddons.map((addon) => {
      const defaultQty = defaultQuantities.get(addon.id) || 0;

      // Priority: 1. Current modal quantity, 2. Original order quantity, 3. Default quantity
      let quantity = defaultQty;

      if (currentModalQuantities.has(addon.name)) {
        quantity = currentModalQuantities.get(addon.name)!;
      } else if (originalOrderQuantities.has(addon.name)) {
        quantity = originalOrderQuantities.get(addon.name)!;
      }

      return {
        Name: addon.name,
        Quantity: quantity,
        Price: addon.price,
        minQuantity: defaultQty,
        modifierId: addon.id,
      };
    });

    console.log('Loaded ALL addons for variant:', variantId, this.addons);
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
    } else {
      console.error('Variant not found for size:', size.SizeName);
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
      // Skip current order being edited (and all its merged copies)
      if (
        this.isMergedOrder &&
        order.drinkName === this.orderData?.drinkName &&
        order.size === this.orderData?.size &&
        this.areAddonsEqual(order.addons, this.orderData?.addons || [])
      ) {
        return;
      }

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
    if (newQuantity > this.maxQuantity) {
      console.warn(`Cannot increase beyond ${this.maxQuantity} - insufficient stock`);
      this.quantity = this.maxQuantity;
      return;
    }

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

  // FIXED: Completely rewritten saveChanges to preserve ALL addon data
  saveChanges() {
    if (this.quantity > this.maxQuantity) {
      alert(`Cannot save more than ${this.maxQuantity} drinks`);
      return;
    }

    // FIXED: Save ALL addons with their quantities, not just ones with quantity > 0
    const allAddons: Addon[] = this.addons.map((a) => ({
      name: a.Name,
      quantity: a.Quantity,
      price: a.Price ?? 0,
      modifierId: a.modifierId,
    }));

    const variantIngredients =
      this.productConfig?.ingredients.filter(
        (ing) => ing.productVariantId === this.selectedVariantId
      ) || [];

    const updatedOrder: OrderItem = {
      tempOrderID: this.orderId,
      drinkID: this.orderData?.drinkID,
      productVariantId: this.selectedVariantId,
      drinkName: this.orderData?.drinkName ?? '',
      drinkCategory: this.orderData?.drinkCategory ?? '',
      imageUrl: this.orderData?.imageUrl || '',
      size: this.activeSize,
      sizePrice: this.sizePrice,
      quantity: this.quantity,
      addons: allAddons,
      total: this.getTotal(), // This should be the final total price
    };

    console.log('=== UPDATED ORDER PAYLOAD (WITH ALL ADDONS) ===');
    console.log(JSON.stringify(updatedOrder, null, 2));

    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');

    if (this.isMergedOrder) {
      // Handle merged order update
      const filteredOrders = existingOrders.filter(
        (o) =>
          !(
            o.drinkName === this.orderData?.drinkName &&
            o.size === this.orderData?.size &&
            this.areAddonsEqual(o.addons, this.orderData?.addons || [])
          )
      );

      filteredOrders.push(updatedOrder);
      localStorage.setItem('orders', JSON.stringify(filteredOrders));
    } else {
      // Single order update
      const index = existingOrders.findIndex((o) => o.tempOrderID === this.orderId);
      if (index !== -1) {
        existingOrders[index] = updatedOrder;
        localStorage.setItem('orders', JSON.stringify(existingOrders));
      }
    }

    console.log('Order updated with ALL addons preserved');
    window.dispatchEvent(new CustomEvent('ordersUpdated'));
    this.closeModal.emit();
  }

  delete() {
    let existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');

    if (this.isMergedOrder) {
      existingOrders = existingOrders.filter(
        (o) =>
          !(
            o.drinkName === this.orderData?.drinkName &&
            o.size === this.orderData?.size &&
            this.areAddonsEqual(o.addons, this.orderData?.addons || [])
          )
      );
    } else {
      existingOrders = existingOrders.filter((o) => o.tempOrderID !== this.orderId);
    }

    localStorage.setItem('orders', JSON.stringify(existingOrders));
    console.log('Order deleted:', this.orderId);

    window.dispatchEvent(new CustomEvent('ordersUpdated'));
    this.closeModal.emit();
  }

  private areAddonsEqual(a: Addon[], b: Addon[]): boolean {
    if (a.length !== b.length) return false;

    const sortedA = [...a].sort((x, y) => x.name.localeCompare(y.name));
    const sortedB = [...b].sort((x, y) => x.name.localeCompare(y.name));

    return sortedA.every(
      (addon, index) =>
        addon.name === sortedB[index].name && addon.quantity === sortedB[index].quantity
    );
  }
}
