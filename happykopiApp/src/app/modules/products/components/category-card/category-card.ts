import { Component, Input } from '@angular/core';
import { FieldCard } from '../field-card/field-card';

@Component({
  selector: 'app-category-card',
  imports: [FieldCard],
  templateUrl: './category-card.html',
  styleUrl: './category-card.css'
})
export class CategoryCard {
  @Input() category: any;
  @Input() isEditing: boolean = false;
}
 