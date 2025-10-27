import { Component, Input, input } from '@angular/core';

export interface oqmDto {
  Quantity: number
}

@Component({
  selector: 'app-order-quantity-modifier',
  imports: [],
  templateUrl: './order-quantity-modifier.html',
  styleUrl: './order-quantity-modifier.css'
})
export class OrderQuantityModifier {
  @Input() oqm!: oqmDto;
}
