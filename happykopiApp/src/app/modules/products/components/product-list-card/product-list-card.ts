import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list-card',
  imports: [],
  templateUrl: './product-list-card.html',
  styleUrl: './product-list-card.css'
})
export class ProductListCard {
  @Input() name!: string;
  @Input() category!: string;
  @Input() icon: string = 'chevron_right';
  @Output() cardClick = new EventEmitter<void>();

  onCardClick() {
    this.cardClick.emit();
  }
}
