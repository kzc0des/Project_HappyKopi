import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CloudinaryPipe } from './cloudinary.pipe';

@Component({
  selector: 'app-product-list-card',
  imports: [CloudinaryPipe],
  templateUrl: './product-list-card.html',
  styleUrl: './product-list-card.css'
})
export class ProductListCard {
  @Input() name!: string;
  @Input() category!: string;
  @Input() icon: string = 'chevron_right';
  @Input() imageUrl!: string;
  @Output() cardClick = new EventEmitter<void>();

  onCardClick() {
    this.cardClick.emit();
  }
}
