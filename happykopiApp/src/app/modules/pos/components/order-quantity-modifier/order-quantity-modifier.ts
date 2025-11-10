import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

export interface oqmDto {
  Quantity: number;
}

@Component({
  selector: 'app-order-quantity-modifier',
  imports: [],
  templateUrl: './order-quantity-modifier.html',
  styleUrl: './order-quantity-modifier.css',
})
export class OrderQuantityModifier implements OnInit {
  @Input() oqm!: oqmDto;
 
  @Output() quantityChange = new EventEmitter<number>();

  ngOnInit() {
    if (!this.oqm || this.oqm.Quantity <= 0) {
      this.oqm = { Quantity: 1 };
    }
  }

  increase() {
    this.oqm.Quantity++; 
    this.quantityChange.emit(this.oqm.Quantity);
  }

  decrease() {
    if (this.oqm.Quantity > 1) {
      this.oqm.Quantity--; 
      this.quantityChange.emit(this.oqm.Quantity);
    }
  }
}
