import { Component, Input, OnInit } from '@angular/core';

export interface oqmDto {
  Quantity: number
}

@Component({
  selector: 'app-order-quantity-modifier',
  imports: [],
  templateUrl: './order-quantity-modifier.html',
  styleUrl: './order-quantity-modifier.css'
})
export class OrderQuantityModifier implements OnInit {
  @Input() oqm!: oqmDto;

  ngOnInit() {
    // ✅ Set default value to 1 if undefined or less than 1
    if (!this.oqm || this.oqm.Quantity <= 0) {
      this.oqm = { Quantity: 1 };
    }
  }

  increase() {
    this.oqm.Quantity++;
  }

  decrease() {
    // ✅ Prevent decreasing to 0 or below
    if (this.oqm.Quantity > 1) {
      this.oqm.Quantity--;
    }
  }
}
