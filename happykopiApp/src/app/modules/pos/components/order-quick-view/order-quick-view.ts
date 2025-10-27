import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface oqvDto {
  OrderNumber: number,
  OrderTotal: number,
  OrderQuantity: number
}

@Component({
  selector: 'app-order-quick-view',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './order-quick-view.html',
  styleUrl: './order-quick-view.css',
})
export class OrderQuickView {
  @Input() oqv!: oqvDto;

  expanded = true;

  toggleCard() {
    this.expanded = !this.expanded;
  }
}
