import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AddButtonCard } from '../../components/add-button-card/add-button-card';

import { Itemcard } from '../../../../shared/components/itemcard/itemcard';
import { DropdownButton } from '../../../../shared/components/dropdown-button/dropdown-button';
import { ModifierSizeCard } from "../../components/modifier-size-card/modifier-size-card";

import { MatIconModule } from '@angular/material/icon'; // Para sa delete icon
import { RecipeBuilderModal, RecipeItem } from '../../components/recipe-builder-modal/recipe-builder-modal';

export interface ModifierSize {
  id: number;
  name: string;
  ozAmount: number;
}

@Component({
  selector: 'app-add-drink-page',
  imports: [
    FormsModule,
    CommonModule,
    AddButtonCard,
    Itemcard,
    DropdownButton,
    ModifierSizeCard,
    RecipeBuilderModal,
    MatIconModule
  ],
  templateUrl: './add-drink-page.html',
  styleUrl: './add-drink-page.css'
})
export class AddDrinkPage implements OnInit {
  isDropdownOpen = false;
  isSizeSelected = false;
  drink: string;

  availableSizes: ModifierSize[] = [];
  selectedSizeId: number | null = 1;

  isRecipeBuilderVisible = false;
  productRecipe: RecipeItem[] = [
    { ingredientId: 1, ingredientName: 'Kape Barako', amount: 15, unit: 'grams' },
    { ingredientId: 2, ingredientName: 'Asukal', amount: 10, unit: 'grams' },
    { ingredientId: 5, ingredientName: 'Ice Cubes', amount: 5, unit: 'pcs' }
  ];

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
      { id: 1, name: 'Tall', ozAmount: 12 },
      { id: 2, name: 'Grande', ozAmount: 16 },
      { id: 3, name: 'Venti', ozAmount: 20 }
    ];
  }

  onSizeSelect(sizeId: number) {
    if (this.selectedSizeId === sizeId) {
      this.selectedSizeId = null;
    } else {
      this.selectedSizeId = sizeId;
    }
  }

  handleOpenRecipeBuilder() {
    this.isRecipeBuilderVisible = true;
  }

  handleRecipeBuilderClose() {
    this.isRecipeBuilderVisible = false;
  }

  handleIngredientAdded(item: RecipeItem) {
    this.productRecipe.push(item);
    this.isRecipeBuilderVisible = false;
  }

  handleRemoveIngredient(ingredientId: number) {
    this.productRecipe = this.productRecipe.filter(
      item => item.ingredientId !== ingredientId
    );
  }

  get existingRecipeIds(): number[] {
    return this.productRecipe.map(item => item.ingredientId);
  }



}
