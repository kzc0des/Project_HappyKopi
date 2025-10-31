import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchFieldCard } from '../../products/components/search-field-card/search-field-card';
import { SelectableCardList } from '../../products/components/selectable-card-list/selectable-card-list';

@Component({
  selector: 'app-assign-drink-page',
  imports: [CommonModule, SearchFieldCard, SelectableCardList],
  templateUrl: './assign-drink-page.html',
  styleUrl: './assign-drink-page.css'
})
export class AssignDrinkPage {
  drinks = [
    { name: 'Thai', category: 'Milk Tea', baseprice: 45.00, available: true},  //image: (wala akong malinaw na copy ng image kaya di ko na nilagyan)
    { name: 'Hokkaido', category: 'Milk Tea', baseprice: 45.00, available: false},
    { name: 'Hot Kopi Latte', category: 'Hot Kopi', baseprice: 45.00, available: true},
    { name: 'Karamel Macchiato', category: 'Milk Tea', baseprice: 45.00, available: true},
    { name: 'Capuccino', category: 'Iced Kopi', baseprice: 45.00, available: false},
    { name: 'Taro', category: 'Milk Tea', baseprice: 45.00, available: true},
  ];

  selectedDrinks: any[] = [];

  toggleSelection(drink: any) {
    const index = this.selectedDrinks.indexOf(drink);

    if (index === -1) {
      this.selectedDrinks.push(drink);
    } else {
      this.selectedDrinks.splice(index, 1);
    }
  }

  onSelectionChange(selected: any[]) {
    this.selectedDrinks = selected;
    console.log('Selected:', selected);
  }

  isSelected(drink: any): boolean {
    return this.selectedDrinks.includes(drink);
  }
}
