import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SizeCard } from '../../components/size-card/size-card';
import { AddButtonCard } from '../../components/add-button-card/add-button-card';
import { FieldCard } from '../../components/field-card/field-card';

@Component({
  selector: 'app-edit-drink-page',
  imports: [FormsModule, CommonModule, SizeCard, AddButtonCard, FieldCard],
  templateUrl: './edit-drink-page.html',
  styleUrl: './edit-drink-page.css'
})
export class EditDrinkPage {
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ingredients = [
    { name: 'Milk', unit: 'mL'},
    { name: 'Sugar Syrup', unit: 'mL'},
    { name: 'Water', unit: 'mL'},
    { name: 'Ice', unit: 'g'}
  ];

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
    //----
  }
}
