import { Component, Input } from '@angular/core';
import { DropdownButton } from "../../../../shared/components/dropdown-button/dropdown-button";
import { Itemcard } from "../../../../shared/components/itemcard/itemcard";
import { YellowButton } from "../../../../shared/components/yellow-button/yellow-button";
import { RedButton } from "../../../../shared/components/red-button/red-button";

@Component({
  selector: 'app-add-ingredient-modal',
  imports: [DropdownButton, Itemcard, YellowButton, RedButton],
  templateUrl: './add-ingredient-modal.html',
  styleUrl: './add-ingredient-modal.css',
})
export class AddIngredientModal {
  @Input() addons !: string;
  @Input() isEditing = false;
}
