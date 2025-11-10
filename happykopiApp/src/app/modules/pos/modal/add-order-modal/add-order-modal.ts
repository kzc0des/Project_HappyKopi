import { Component, Input, OnInit } from '@angular/core';
import { AddonCardActive } from '../../components/addon-card-active/addon-card-active';
import { OrderQuickView } from '../../components/order-quick-view/order-quick-view';
import { OrderQuantityModifier } from '../../components/order-quantity-modifier/order-quantity-modifier';
import { GrandeActive, sizeButtonDto } from '../../components/grande-active/grande-active';
import { Login } from '../../../auth/login/login';
import { LongYellowButton } from '../../../../shared/components/long-yellow-button/long-yellow-button';
import { CurrencyPipe } from '@angular/common';
import { OrderModifierSummaryDto } from '../../../../core/dtos/order/order-modifier-summary.to';
import { ModifierType } from '../../../../core/enums/modifier-type';
import { OrderService } from '../../services/order.service';

export interface addOrderModalDto {
  DrinkName: string;
  DrinkCategory: string;
  Total: number;
}

@Component({
  selector: 'app-add-order-modal',
  imports: [AddonCardActive, OrderQuantityModifier, GrandeActive, LongYellowButton, CurrencyPipe],
  templateUrl: './add-order-modal.html',
  styleUrl: './add-order-modal.css',
})
export class AddOrderModal implements OnInit {
  @Input() addOrderModal?: addOrderModalDto;

  sizes: sizeButtonDto[] = [];
  activeSize: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadSizes();

    this.addOrderModal = {
      DrinkName: this.addOrderModal?.DrinkName || 'Drink Name',
      DrinkCategory: this.addOrderModal?.DrinkCategory || 'Drink Category',
      Total: this.addOrderModal?.Total ?? 0,
    };
  }

  loadSizes() {
    this.orderService.getModifiersByType(ModifierType.Sizes).subscribe({
      next: (sizes: OrderModifierSummaryDto[]) => {
        this.sizes = sizes.map((size) => ({
          SizeName: size.name,
          SizeQuantity: size.price, 
        }));
 
        if (this.sizes.length > 0) {
          this.activeSize = this.sizes[0].SizeName;
        }
      },
      error: (err) => console.error('Error loading sizes:', err),
    });
  }

  selectSize(size: sizeButtonDto) {
    this.activeSize = size.SizeName;
  }
}
