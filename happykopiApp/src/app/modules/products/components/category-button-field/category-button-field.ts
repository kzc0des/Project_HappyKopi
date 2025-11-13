import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-button-field',
  imports: [RouterLink],
  templateUrl: './category-button-field.html',
  styleUrl: './category-button-field.css'
})
export class CategoryButtonField {
  @Input() categoryName: string = 'All Drinks';
  @Input() drinkCount: number = 0;

  constructor(private router: Router) { }
}

