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
import { OrderService } from '../../services/order.service';
import { Addon, OrderItem } from '../../../../core/dtos/order/order-item.dto';
import { ProductConfigurationResultDto } from '../../../../core/dtos/order/product-configuration-result.dto';

interface AddonWithConfig extends addonCardDto {
  minQuantity: number;
  modifierId: number;
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

  sizes: sizeButtonDto[] = [];
  addons: AddonWithConfig[] = [];
  activeSize: string = '';
  selectedVariantId: number = 0;
  quantity: number = 1;
  orderData?: OrderItem;
  productConfig?: ProductConfigurationResultDto;

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
          this.sizes = config.variants.map((v) => ({
            SizeName: v.sizeName,
            SizeQuantity: v.price,
          }));
 
          const savedVariant = config.variants.find((v) => v.sizeName === this.orderData!.size);
          if (savedVariant) {
            this.selectedVariantId = savedVariant.id;
          } else {
            this.selectedVariantId = config.variants[0].id;
          }

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
 
      const savedAddon = this.orderData?.addons.find((a) => a.name === addon.name);
      const quantity = savedAddon ? savedAddon.quantity : defaultQty;

      return {
        Name: addon.name,
        Quantity: quantity,
        Price: addon.price,
        minQuantity: defaultQty,
        modifierId: addon.id
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

  saveChanges() {
    const selectedAddons: Addon[] = this.addons
      .filter((a) => a.Quantity > 0)
      .map((a) => ({
        name: a.Name,
        quantity: a.Quantity,
        price: a.Price ?? 0,
        modifierId: a.modifierId
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
