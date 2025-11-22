import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-category-card',
  imports: [CommonModule],
  templateUrl: './category-card.html',
  styleUrl: './category-card.css',
})
export class CategoryCard {
  @Input() itemTitle!: string;
  @Input() itemValue: number = 0;
  @Input() selectedCategoryId: number | null = null;
  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }

  get isSelected(): boolean {
    return this.selectedCategoryId === this.itemValue;
  }
}
