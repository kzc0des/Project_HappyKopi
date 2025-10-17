import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drink-list-page',
  imports: [CommonModule],
  templateUrl: './drink-list-page.html',
  styleUrl: './drink-list-page.css'
})
export class DrinkListPage {
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  //sample data
  drinks = [
    { name: 'Thai', category: 'Milk Tea'},  //image: (wala akong malinaw na copy ng image kaya di ko na nilagyan)
    { name: 'Matcha', category: 'Milk Tea'},
    { name: 'Caramel', category: 'Iced Kopi'},
  ];

  drinkId: string | null = null;

  constructor(private router: Router) {}

  goToDrink(drink: any) {
    this.router.navigate(['/drink-detail', drink.name]);
  }
}
