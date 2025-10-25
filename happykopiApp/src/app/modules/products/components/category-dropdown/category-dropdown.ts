import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-dropdown',
  imports: [CommonModule],
  templateUrl: './category-dropdown.html',
  styleUrl: './category-dropdown.css'
})
export class CategoryDropdown {
  @Input() label: string = 'Category';
  @Input() items: string[] = [];
  @Input() selectedItem: string | null = null;

  @Output() selectedItemChange = new EventEmitter<string>();

  @Output() selectionChange = new EventEmitter<string>();

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectItem(item: string, event: MouseEvent) {
    event.stopPropagation();
    this.selectedItem = item;
    this.selectedItemChange.emit(item);
    this.selectionChange.emit(item);
    this.isDropdownOpen = false;
  }
}
