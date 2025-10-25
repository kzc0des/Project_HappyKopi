import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingredient-card',
  imports: [CommonModule],
  templateUrl: './ingredient-card.html',
  styleUrl: './ingredient-card.css'
})
export class IngredientCard {
  @Input() ingredient! : {
    name: string;
    value: number;
    unit: string;
  }
}
