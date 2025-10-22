import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-drink-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-drink-page.html',
  styleUrl: './add-drink-page.css'
})
export class AddDrinkPage {
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
}
