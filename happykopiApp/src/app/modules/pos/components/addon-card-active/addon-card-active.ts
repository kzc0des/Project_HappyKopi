import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export interface addonCardDto {
  Name: string;
  Quantity: number;
}

@Component({
  selector: 'app-addon-card-active',
  imports: [CommonModule],
  templateUrl: './addon-card-active.html',
  styleUrls: ['./addon-card-active.css'],
})
export class AddonCardActive {
  @Input() addonCard!: addonCardDto;

  // ✅ Increase quantity
  increase(): void {
    this.addonCard.Quantity++;
  }

  // ✅ Decrease quantity (cannot go below 0)
  decrease(): void {
    if (this.addonCard.Quantity > 0) {
      this.addonCard.Quantity--;
    }
  }

  // ✅ Check if quantity is 0
  get isZero(): boolean {
    return this.addonCard.Quantity === 0;
  }
}
