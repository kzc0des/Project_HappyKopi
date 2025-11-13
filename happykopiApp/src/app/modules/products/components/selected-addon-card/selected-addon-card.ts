import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddOnItem } from '../../../../core/dtos/product/product.model';

@Component({
  selector: 'app-selected-addon-card',
  imports: [],
  templateUrl: './selected-addon-card.html',
  styleUrl: './selected-addon-card.css',
})
export class SelectedAddonCard {
  @Input() addon!: AddOnItem;
  @Output() edit = new EventEmitter<void>();

  onEdit(): void {
    this.edit.emit();
  }
}
