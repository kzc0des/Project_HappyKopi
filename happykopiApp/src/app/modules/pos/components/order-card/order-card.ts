import { Component, Input } from '@angular/core';

export interface orderCardDto {
  DrinkName: string,
  DrinkCategory: string,
  DrinkImage: string // podi palitan
}

@Component({
  selector: 'app-order-card',
  imports: [],
  templateUrl: './order-card.html',
  styleUrl: './order-card.css'
})
export class OrderCard {
  @Input() orderCard!: orderCardDto
}
