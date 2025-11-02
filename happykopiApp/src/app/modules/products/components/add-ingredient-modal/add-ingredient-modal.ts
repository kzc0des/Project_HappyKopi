import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownButton } from "../../../../shared/components/dropdown-button/dropdown-button";
import { Itemcard } from "../../../../shared/components/itemcard/itemcard";
import { YellowButton } from "../../../../shared/components/yellow-button/yellow-button";
import { RedButton } from "../../../../shared/components/red-button/red-button";
import { Observable } from 'rxjs';
import { ModalService } from '../../services/modal-service/modal.service';
import { AsyncPipe } from '@angular/common';
import { DropdownOption } from '../../../../shared/components/dropdown-button/dropdown-option';
import { RecipeItem } from '../../../../core/dtos/product/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-ingredient-modal',
  imports: [DropdownButton, Itemcard, YellowButton, RedButton, AsyncPipe, FormsModule],
  templateUrl: './add-ingredient-modal.html',
  styleUrl: './add-ingredient-modal.css',
})
export class AddIngredientModal {
  @Input() isEditing = false;

  @Input() categoryOptions: DropdownOption[] = [];
  @Input() ingredientOptions: DropdownOption[] = [];
  @Output() saveIngredient = new EventEmitter<RecipeItem>()

  public selectedCategoryId: number | null = null;
  public selectedIngredientId: number | null = null;
  public quantityNeeded: number = 0;

  isIngredientOpen$: Observable<boolean>;

  constructor (
    private modalService: ModalService
  ) {
    this.isIngredientOpen$ = modalService.isIngredientModalOpen$;
  }

  close() {
    this.modalService.closeIngredientModal();
    this.selectedCategoryId = null;
    this.selectedIngredientId = null;
    this.quantityNeeded = 0;
  }

  onSave() {
    if (this.selectedIngredientId && this.quantityNeeded > 0) {
      const payload: RecipeItem = {
        stockItemId: this.selectedIngredientId,
        quantityNeeded: this.quantityNeeded
      };
      this.saveIngredient.emit(payload);
      this.close();
    } else {
      console.log("Fill out all the fields.");
    }
  }
}
