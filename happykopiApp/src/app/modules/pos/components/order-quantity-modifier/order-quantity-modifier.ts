import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface oqmDto {
  Quantity: number;
}

@Component({
  selector: 'app-order-quantity-modifier',
  imports: [CommonModule],
  templateUrl: './order-quantity-modifier.html',
  styleUrl: './order-quantity-modifier.css',
})
export class OrderQuantityModifier implements OnInit {
  @Input() oqm!: oqmDto;
  @Input() maxQuantity: number = 999;
  @Output() quantityChange = new EventEmitter<number>();

  ngOnInit() {
    if (!this.oqm || this.oqm.Quantity <= 0) {
      this.oqm = { Quantity: 1 };
    }
  }

  increase() {
    if (this.oqm.Quantity < this.maxQuantity) {
      this.oqm.Quantity++;
      this.quantityChange.emit(this.oqm.Quantity);
    } else { 
      this.quantityChange.emit(this.maxQuantity + 1);
    }
  }

  decrease() {
    if (this.oqm.Quantity > 1) {
      this.oqm.Quantity--;
      this.quantityChange.emit(this.oqm.Quantity);
    }
  }
}