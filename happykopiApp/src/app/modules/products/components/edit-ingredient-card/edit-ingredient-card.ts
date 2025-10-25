import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-ingredient-card',
  imports: [],
  templateUrl: './edit-ingredient-card.html',
  styleUrl: './edit-ingredient-card.css'
})
export class EditIngredientCard {
  @Input() name!: string;
  @Input() unit!: string;
  @Input() value: string = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() remove = new EventEmitter<void>();

  onValueChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }

  onRemoveClick() {
    this.remove.emit();
  }
}
