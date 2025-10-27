import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list-card',
  imports: [CommonModule],
  templateUrl: './category-list-card.html',
  styleUrl: './category-list-card.css'
})
export class CategoryListCard {
  @Input() items: any[] = [];
  @Input() labelKey = 'name';       
  @Input() subLabelKey?: string;   
  @Input() subLabelSuffix?: string;   
  @Input() clickable = true;          
  @Output() itemClick = new EventEmitter<any>();

  onClick(item: any): void {
    if (this.clickable) this.itemClick.emit(item);
  }
}
