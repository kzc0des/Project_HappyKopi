import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Itemcard } from '../../../shared/components/itemcard/itemcard';
import { DropdownButton } from '../../../shared/components/dropdown-button/dropdown-button';
import { ModifierSizeCard } from '../../products/components/modifier-size-card/modifier-size-card';
import { AddButtonCard } from '../../products/components/add-button-card/add-button-card';
import { AddAddonModal } from '../../products/components/add-addon-modal/add-addon-modal';
import { AddIngredientModal } from '../../products/components/add-ingredient-modal/add-ingredient-modal';
import { YellowButton } from '../../../shared/components/yellow-button/yellow-button';
import { SelectedAddonCard } from '../../products/components/selected-addon-card/selected-addon-card';
import { SelectedIngredientCard } from '../../products/components/selected-ingredient-card/selected-ingredient-card';

@Component({
  selector: 'app-create-drink-page',
  imports: [
    CommonModule, 
    FormsModule, 
    Itemcard, 
    DropdownButton, 
    ModifierSizeCard, 
    AddButtonCard, 
    AddAddonModal, 
    AddIngredientModal, 
    YellowButton,
    SelectedAddonCard,
    SelectedIngredientCard
  ],
  templateUrl: './create-drink-page.html',
  styleUrl: './create-drink-page.css'
})
export class CreateDrinkPage {
   category: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.category = navigation?.extras?.state?.['category'];
    console.log(this.category);
  }

  selectedSize: string | null = null;

  selectSize(size: string) {
    this.selectedSize = size;
  }
}
