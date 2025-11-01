import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  selector: 'app-recipe-builder-modal',
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './recipe-builder-modal.html',
  styleUrl: './recipe-builder-modal.css',
})
export class RecipeBuilderModal {
  @Input() isVisible: boolean = false;
  @Input() existingRecipeIds: number[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onIngredientAdd = new EventEmitter<RecipeItem>();

  ingredientInputText: string = '';       // Para sa text na tina-type
  selectedIngredient: Ingredient | null = null; // Para sa actual selected object
  selectedAmount: number | null = null;

  selectedIngredientUnit: string = '';
  allIngredients: Ingredient[] = [];
  filteredIngredients: Ingredient[] = [];

  constructor() { }

  ngOnInit() {
    this.allIngredients = [
      { id: 1, name: 'Kape Barako', unitOfMeasurement: 'grams' },
      { id: 2, name: 'Asukal', unitOfMeasurement: 'grams' },
      { id: 3, name: 'Gatas (Evap)', unitOfMeasurement: 'ml' },
      { id: 4, name: 'Tubig', unitOfMeasurement: 'ml' },
      { id: 5, name: 'Ice Cubes', unitOfMeasurement: 'pcs' },
    ];
    // ***************************************************************

    this.filteredIngredients = this.allIngredients.slice();
  }

  /**
   * Nagfi-filter ng listahan habang nagta-type si user
   */
  filterIngredients() {
    const filterValue = this.ingredientInputText.toLowerCase();
    this.filteredIngredients = this.allIngredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Ito 'yung "Magic". Triggered kapag PUMILI si user sa dropdown.
   */
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedIngredient = event.option.value;
    if (this.selectedIngredient) { 
      this.ingredientInputText = this.selectedIngredient.name; // Ilagay ang pangalan sa input
      this.selectedIngredientUnit = this.selectedIngredient.unitOfMeasurement;
      this.selectedAmount = null; // I-reset ang amount
    }
  }

  /**
   * Ito 'yung "Pagpigil" (Strict Selection).
   * Triggered kapag umalis (blur) si user sa input.
   */
  onIngredientInputBlur() {
    // Kung ang text sa input ay HINDI TUGMA sa pangalan ng nakapiling ingredient...
    if (this.ingredientInputText !== this.selectedIngredient?.name) {
      // ...burahin mo lahat.
      this.resetForm();
    }
  }

  /**
   * Pang-dagdag sa recipe list.
   */
  addIngredientToRecipe() {
    if (!this.selectedIngredient || !this.selectedAmount || this.selectedAmount <= 0) {
      return;
    }

    if (this.existingRecipeIds.includes(this.selectedIngredient.id)) {
      alert('Ingredient already added to recipe.');
      return;
    }

    const newRecipeItem: RecipeItem = {
      ingredientId: this.selectedIngredient.id,
      ingredientName: this.selectedIngredient.name,
      amount: this.selectedAmount,
      unit: this.selectedIngredientUnit
    };

    this.onIngredientAdd.emit(newRecipeItem);
    this.resetForm();
  }

  /**
   * Pang-close ng modal.
   */
  closeModal() {
    this.onClose.emit();
    this.resetForm();
  }

  /**
   * Helper function para mag-reset.
   */
  private resetForm() {
    this.ingredientInputText = '';
    this.selectedIngredient = null;
    this.selectedAmount = null;
    this.selectedIngredientUnit = '';
    this.filteredIngredients = this.allIngredients.slice();
  }
}
