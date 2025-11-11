import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecipeItem } from '../../../../core/dtos/product/product.model';

@Component({
  selector: 'app-selected-ingredient-card',
  imports: [],
  templateUrl: './selected-ingredient-card.html',
  styleUrl: './selected-ingredient-card.css',
})
export class SelectedIngredientCard {
  @Input() ingredient!: RecipeItem;
  @Output() edit = new EventEmitter<void>();

  onEdit(): void {
    this.edit.emit();
  }
}
