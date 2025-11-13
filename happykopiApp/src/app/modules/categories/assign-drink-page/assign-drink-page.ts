import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductWithCategoryNameDto } from '../../../core/dtos/category/product-with-category-name-dto';

@Component({
  selector: 'app-assign-drink-page',
  imports: [CommonModule],
  templateUrl: './assign-drink-page.html',
  styleUrl: './assign-drink-page.css'
})
export class AssignDrinkPage implements OnInit{
  drinks: ProductWithCategoryNameDto[] = [];
  selectedDrinks: ProductWithCategoryNameDto[] = [];

  constructor (
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const datalist: ProductWithCategoryNameDto[] | null = this.route.snapshot.data['products'];
    if (datalist) {
      this.drinks = datalist;
    }
    console.log(this.drinks);
  }

  toggleSelection(drink: ProductWithCategoryNameDto) {
    const index = this.selectedDrinks.findIndex(d => d.id === drink.id);

    if (index === -1) {
      this.selectedDrinks.push(drink);
    } else {
      this.selectedDrinks.splice(index, 1);
    }
    console.log('Selected Drinks:', this.selectedDrinks);
  }

  onSelectionChange(selected: any[]) {
    this.selectedDrinks = selected;
    console.log('Selected:', selected);
  }

  isSelected(drink: ProductWithCategoryNameDto): boolean {
    return this.selectedDrinks.some(d => d.id === drink.id);
  }
}
