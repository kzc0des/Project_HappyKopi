import { Component, Input, OnInit } from '@angular/core'; 
import { AddonCardActive } from "../../components/addon-card-active/addon-card-active";
import { OrderQuickView } from "../../components/order-quick-view/order-quick-view";
import { OrderQuantityModifier } from "../../components/order-quantity-modifier/order-quantity-modifier";
import { GrandeActive, sizeButtonDto } from "../../components/grande-active/grande-active";
import { Login } from "../../../auth/login/login";
import { LongYellowButton } from "../../../../shared/components/long-yellow-button/long-yellow-button";
import { CurrencyPipe } from '@angular/common';

export interface addOrderModalDto {
  DrinkName: string,
  DrinkCategory: string,
  Total: number
}

@Component({
  selector: 'app-add-order-modal',
  imports: [AddonCardActive, OrderQuantityModifier, GrandeActive, LongYellowButton, CurrencyPipe],
  templateUrl: './add-order-modal.html',
  styleUrl: './add-order-modal.css'
})
export class AddOrderModal implements OnInit {
  @Input() addOrderModal?: addOrderModalDto;

  sizes: sizeButtonDto[] = [
    { SizeName: 'Grande', SizeQuantity: 16 },
    { SizeName: 'Venti', SizeQuantity: 22 }
  ];
  activeSize: string = 'Grande'; // default active

  ngOnInit() {
    // Merge parent data with defaults
    this.addOrderModal = {
      DrinkName: this.addOrderModal?.DrinkName || 'Drink Name',
      DrinkCategory: this.addOrderModal?.DrinkCategory || 'Drink Category',
      Total: this.addOrderModal?.Total ?? 0  // ?? because 0 is falsy
    };
  }

  selectSize(size: sizeButtonDto) {
    this.activeSize = size.SizeName;
  }
}
