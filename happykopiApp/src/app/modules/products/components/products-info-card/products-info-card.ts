import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-info-card',
  imports: [CommonModule],
  templateUrl: './products-info-card.html',
  styleUrl: './products-info-card.css'
})
export class ProductsInfoCard {
   @Input() drink!: {
    name: string;
    baseprice: number;
    category: string;
    available: boolean;
  };
}
