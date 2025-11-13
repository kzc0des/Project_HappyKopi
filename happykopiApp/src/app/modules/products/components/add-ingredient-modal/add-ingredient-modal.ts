import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownButton } from "../../../../shared/components/dropdown-button/dropdown-button";
import { Itemcard } from "../../../../shared/components/itemcard/itemcard";
import { YellowButton } from "../../../../shared/components/yellow-button/yellow-button";
import { RedButton } from "../../../../shared/components/red-button/red-button";
import { Observable } from 'rxjs';
import { ModalService } from '../../services/modal-service/modal.service';
import { AsyncPipe } from '@angular/common';
import { DropdownOption } from '../../../../shared/components/dropdown-button/dropdown-option';
import { FormsModule } from '@angular/forms';
import { RecipeItem } from '../../../../core/dtos/product/product.model';

@Component({
  selector: 'app-add-ingredient-modal',
  imports: [DropdownButton, Itemcard, YellowButton, RedButton, AsyncPipe, FormsModule],
  templateUrl: './add-ingredient-modal.html',
  styleUrl: './add-ingredient-modal.css',
})
export class AddIngredientModal {
  @Input() isEditing = false;
  @Input() categoryOptions: DropdownOption[] = [];
  @Input() ingredient: RecipeItem | null = null;
  
  @Output() saveIngredient = new EventEmitter<RecipeItem>();
  @Output() deleteIngredient = new EventEmitter<void>();

  public hasChanges: boolean = false;
  private _initialIngredientState: { categoryId: string | number | null; ingredientId: number | null; quantityNeeded: number; } | null = null;


  public filteredIngredientOptions: DropdownOption[] = [];
  private _allIngredientOptions: DropdownOption[] = [];

  @Input()
  set ingredientOptions(options: DropdownOption[]) {
    this._allIngredientOptions = options;
    // Re-evaluate filtering when options are set, especially if editing
    this.updateModalFieldsForEdit();
  }

  ngOnChanges() {
    this.resetFormFields();

    if (this.isEditing && this.ingredient) { // If editing, populate with ingredient data
      this.selectedIngredientId = this.ingredient.ingredientId;
      this.quantityNeeded = this.ingredient.quantityNeeded;
      this.updateModalFieldsForEdit();
    }
    this.updateHasChanges();
  }

  private updateModalFieldsForEdit(): void {
    // This method is called when editing an existing ingredient.
    // It sets the selected category and ingredient ID based on the input ingredient.
    // It also stores the initial state for change tracking.

    if (this.isEditing && this.ingredient && this._allIngredientOptions.length > 0) {
      const selectedOption = this._allIngredientOptions.find(
        opt => opt.value === this.ingredient?.ingredientId
      );
      if (selectedOption) {
        this.selectedCategoryId = selectedOption.type ? selectedOption.type : null;
        this.selectedIngredientId = selectedOption.value
        this.filterIngredients(this.selectedCategoryId, true); // Pass true to keep selectedIngredientId from being reset

        this._initialIngredientState = {
          categoryId: this.selectedCategoryId,
          ingredientId: this.selectedIngredientId,
          quantityNeeded: this.quantityNeeded
        };
      }
    }
  }

  public selectedCategoryId: string | null = null;
  public selectedIngredientId: number | null = null;
  public quantityNeeded: number = 0;

  isIngredientOpen$: Observable<boolean>;

  constructor(
    private modalService: ModalService
  ) {
    this.isIngredientOpen$ = modalService.isIngredientModalOpen$;
  }
  
  // Added a parameter `keepSelectedIngredientId` to prevent resetting it during editing initialization
  filterIngredients(categoryValue: string | number | null, keepSelectedIngredientId: boolean = false) {
    if (!categoryValue) {
      this.filteredIngredientOptions = this._allIngredientOptions;
    } else {
      this.filteredIngredientOptions = this._allIngredientOptions.filter(option =>
        option.type === categoryValue
      );
      // If the previously selected ingredient is no longer in the filtered list, clear it.
    }
    if (!keepSelectedIngredientId) {
      this.selectedIngredientId = null;
    }
    this.updateHasChanges();
  }

  onCategoryChange(value: string | null) {
    this.selectedCategoryId = value;
    this.filterIngredients(value);
  }

  onIngredientChange(value: number | null) {
    this.selectedIngredientId = value;
    this.updateHasChanges();
  }

  onQuantityChange(value: number) {
    this.quantityNeeded = value;
    this.updateHasChanges();
  }

  close() {
    this.modalService.closeIngredientModal();
    this.resetFormFields();
  }

  private resetFormFields(): void {
    this.filteredIngredientOptions = this._allIngredientOptions; // Reset to all options
    this.selectedCategoryId = null;
    this.selectedIngredientId = null;
    this.quantityNeeded = 0;
    this.hasChanges = false;
    this._initialIngredientState = null;
  }

  private updateHasChanges(): void {
    if (this.isEditing && this._initialIngredientState) {
      this.hasChanges =
        this.selectedCategoryId !== this._initialIngredientState.categoryId ||
        this.selectedIngredientId !== this._initialIngredientState.ingredientId ||
        this.quantityNeeded !== this._initialIngredientState.quantityNeeded;
    } else {
      this.hasChanges = this.selectedIngredientId !== null && this.quantityNeeded > 0;
    }
  }

  onSave() {
    if (this.selectedIngredientId && this.quantityNeeded > 0) {
      
      const selectedOption = this._allIngredientOptions.find(
        opt => opt.value === this.selectedIngredientId
      );

      if (!selectedOption) {
        console.error('Could not find selected ingredient option.');
        return;
      }

      const labelMatch = selectedOption.label.match(/(.*) \((.*)\)/);
      let ingredientName = selectedOption.label;
      let unitOfMeasure = '';

      if (labelMatch && labelMatch[1] && labelMatch[2]) {
        ingredientName = labelMatch[1].trim();
        unitOfMeasure = labelMatch[2].trim();
      }

      const payload: RecipeItem = {
        ingredientId: this.selectedIngredientId,
        quantityNeeded: this.quantityNeeded,
        ingredientName: ingredientName,
        unitOfMeasure: unitOfMeasure
      };

      this.saveIngredient.emit(payload);
      this.close(); // Close and reset after save
    }    
  }

  onDelete(): void {
    this.deleteIngredient.emit();
    this.close(); // Close and reset after delete
  }
}