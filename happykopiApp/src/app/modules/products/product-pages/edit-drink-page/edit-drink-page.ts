import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SizeCard } from '../../components/size-card/size-card';
import { AddButtonCard } from '../../components/add-button-card/add-button-card';
import { FieldCard } from '../../components/field-card/field-card';
import { ToggleCard } from '../../components/toggle-card/toggle-card';
import { EditPhotoCard } from '../../components/edit-photo-card/edit-photo-card';
import { CategoryDropdown } from '../../components/category-dropdown/category-dropdown';
import { EditIngredientCard } from '../../components/edit-ingredient-card/edit-ingredient-card';

@Component({
  selector: 'app-edit-drink-page',
  imports: [FormsModule, CommonModule, SizeCard, AddButtonCard, FieldCard, ToggleCard, EditPhotoCard, CategoryDropdown, EditIngredientCard],
  templateUrl: './edit-drink-page.html',
  styleUrl: './edit-drink-page.css'
})
export class EditDrinkPage {
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ingredients = [
    { name: 'Milk', unit: 'mL', value: ''},
    { name: 'Sugar Syrup', unit: 'mL', value: ''},
    { name: 'Water', unit: 'mL', value: ''},
    { name: 'Ice', unit: 'g', value: ''}
  ];

  onIngredientValueChange(index: number, newValue: string) {
    this.ingredients[index].value = newValue;
  }

  removeIngredient(ingredient: any) {
    this.ingredients = this.ingredients.filter(i => i !== ingredient);
  }

  drink: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.drink = nav?.extras.state?.['drink'];
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('name');
  }

  selectedSize = 'grande'; 

  onSizeChange(newSize: string) {
    this.selectedSize = newSize;
    console.log('Parent got:', this.selectedSize);
  }

  onAddIngredient() {
    //redirect to another page...
  }

  selectedCategory = 'Milk Tea';

  onCategorySelected(category: string) {
    console.log('Selected:', category);
  }
}
