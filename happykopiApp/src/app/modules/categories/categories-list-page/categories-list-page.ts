import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryListCard } from '../component/category-list-card/category-list-card';

@Component({
  selector: 'app-categories-list-page',
  imports: [CommonModule, FormsModule, CategoryListCard],
  templateUrl: './categories-list-page.html',
  styleUrl: './categories-list-page.css'
})
export class CategoriesListPage {
  constructor(private router: Router) {}

  categories = [
    { name: 'All Drinks', count: 33 },
    { name: 'Milk Tea', count: 9 },
    { name: 'Fruit Tea', count: 6 },
    { name: 'Hot Kopi', count: 9 },
    { name: 'Iced Kopi', count: 9 },
  ];

  goToCategory(category: any) {
    this.router.navigate(['/drink-list-page'], { state: { category } });
  }
}
