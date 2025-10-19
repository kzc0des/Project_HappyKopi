import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-drink-detail-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './drink-detail-page.html',
  styleUrl: './drink-detail-page.css'
})
export class DrinkDetailPage {
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ingredients = [
    { name: 'Milk', unit: 'ml'},
    { name: 'Sugar Syrup', unit: 'ml'},
    { name: 'Water', unit: 'ml'},
    { name: 'Ice', unit: 'g'},
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
    console.log('Drink Name:', name);
  }
}

