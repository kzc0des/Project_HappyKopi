import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AddButtonCard } from '../../components/add-button-card/add-button-card';

import { Itemcard } from '../../../../shared/components/itemcard/itemcard';
import { DropdownButton } from '../../../../shared/components/dropdown-button/dropdown-button';
import { ModifierSizeCard } from "../../components/modifier-size-card/modifier-size-card";

export interface ModifierSize {
  id: number;
  name: string;
  ozAmount: number;
}

export interface Ingredient {
  id: number;
  name: string;
  unitOfMeasurement: string;
}

export interface RecipeItem {
  ingredientId: number;
  ingredientName: string; 
  amount: number;
  unit: string;
}

@Component({
  selector: 'app-add-drink-page',
  imports: [FormsModule, CommonModule, AddButtonCard, Itemcard, DropdownButton, ModifierSizeCard],
  templateUrl: './add-drink-page.html',
  styleUrl: './add-drink-page.css'
})
export class AddDrinkPage {
  isDropdownOpen = false;
  isSizeSelected = false;
  drink: string;

  availableSizes: ModifierSize[] = [];

  selectedSizeId: number | null = 1;

  constructor(private route: ActivatedRoute, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.drink = nav?.extras.state?.['drink'];
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('name');
    this.fetchSizesFromDatabase();
  }

  fetchSizesFromDatabase() {
    this.availableSizes = [
      { id: 1, name: 'Tall', ozAmount:12 },
      { id: 2, name: 'Grande', ozAmount:16 },
      { id: 3, name: 'Venti', ozAmount:20 }
    ];
  }

  onSizeSelect(sizeId: number) {
    if (this.selectedSizeId === sizeId) {
      this.selectedSizeId = null;
    } else {
      this.selectedSizeId = sizeId;
    }
  }



}
