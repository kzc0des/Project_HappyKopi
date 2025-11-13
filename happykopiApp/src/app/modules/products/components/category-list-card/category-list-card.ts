import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list-card',
  imports: [CommonModule],
  templateUrl: './category-list-card.html',
  styleUrl: './category-list-card.css'
})
export class CategoryListCard {
  @Input() categoryId: number = 0;
  @Input() itemTitle !: string;
  @Input() itemValue: number | undefined;
  @Input() itemUnit !: string;
  @Output() itemClick = new EventEmitter<any>();
}
