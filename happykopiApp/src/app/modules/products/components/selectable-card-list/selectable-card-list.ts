import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selectable-card-list',
  imports: [CommonModule],
  templateUrl: './selectable-card-list.html',
  styleUrl: './selectable-card-list.css'
})
export class SelectableCardList {
  @Input() items: any[] = [];
  @Input() labelKey = 'name';      
  @Input() subLabelKey?: string;    
  @Input() selectedItems: any[] = [];

  @Output() selectionChange = new EventEmitter<any[]>(); 

  isSelected(item: any): boolean {
    return this.selectedItems.includes(item);
  }

  toggleSelection(item: any): void {
    const index = this.selectedItems.indexOf(item);
    if (index === -1) {
      this.selectedItems = [...this.selectedItems, item];
    } else {
      this.selectedItems = this.selectedItems.filter(i => i !== item);
    }
    this.selectionChange.emit(this.selectedItems);
  }
}
