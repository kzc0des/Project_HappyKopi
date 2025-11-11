import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface addonCardDto {
  Name: string;
  Quantity: number;
  Price: number;
}

@Component({
  selector: 'app-addon-card-active',
  imports: [CommonModule],
  templateUrl: './addon-card-active.html',
  styleUrls: ['./addon-card-active.css'],
})
export class AddonCardActive implements OnInit {
  @Input() addonCard!: addonCardDto;
  @Output() quantityChange = new EventEmitter<number>();

  ngOnInit() {
    if (this.addonCard.Quantity == null) {
      this.addonCard.Quantity = 0;
    }
  }

  increase(): void {
    this.addonCard.Quantity++;
    this.quantityChange.emit(this.addonCard.Quantity);
  }

  decrease() {
    if (this.addonCard.Quantity > this.minQuantity) {
      this.addonCard.Quantity--;
      this.quantityChange.emit(this.addonCard.Quantity);
    }
  }
 
  @Input() minQuantity: number = 0;

  get isZero(): boolean {
    return this.addonCard.Quantity === 0;
  }
}
