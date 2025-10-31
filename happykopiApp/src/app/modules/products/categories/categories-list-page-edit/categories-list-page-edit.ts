import { Component } from '@angular/core';
import { CategoryListCardEdit } from "../../components/category-list-card-edit/category-list-card-edit";

@Component({
  selector: 'app-categories-list-page-edit',
  imports: [CategoryListCardEdit],
  templateUrl: './categories-list-page-edit.html',
  styleUrl: './categories-list-page-edit.css'
})
export class CategoriesListPageEdit {
  categories = [
    { name: 'All Drinks', count: 33 },
    { name: 'Milk Tea', count: 9 },
    { name: 'Fruit Tea', count: 6 },
    { name: 'Hot Kopi', count: 9 },
    { name: 'Iced Kopi', count: 9 },
  ];
}
