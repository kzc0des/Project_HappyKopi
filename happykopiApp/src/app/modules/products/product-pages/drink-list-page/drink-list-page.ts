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

  drinks = [
    { name: 'Thai', category: 'Milk Tea', baseprice: 45.00, available: true},  //image: (wala akong malinaw na copy ng image kaya di ko na nilagyan)
    { name: 'Hokkaido', category: 'Milk Tea', baseprice: 45.00, available: false},
    { name: 'Hot Kopi Latte', category: 'Hot Kopi', baseprice: 45.00, available: true},
    { name: 'Karamel Macchiato', category: 'Milk Tea', baseprice: 45.00, available: true},
    { name: 'Capuccino', category: 'Iced Kopi', baseprice: 45.00, available: false},
    { name: 'Taro', category: 'Milk Tea', baseprice: 45.00, available: true},
  ];

  constructor(private router: Router) {}

  goToDrink(drink: any) {
    this.router.navigate(['/drink-detail', drink.name], { state: { drink } });
  }

  goToCategory() {
    this.router.navigate(['/categories-list-page'])
  }
}
