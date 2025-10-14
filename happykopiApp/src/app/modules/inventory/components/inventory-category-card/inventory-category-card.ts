import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inventory-category-card',
  imports: [RouterLink],
  templateUrl: './inventory-category-card.html',
  styleUrl: './inventory-category-card.css'
})
export class InventoryCategoryCard {
  @Input() categoryName: string = ''; 
  @Input() categoryNumberOfItems: number = 0;
}
