import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-drink',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-drink.html',
  styleUrl: './search-drink.css',
})
export class SearchDrink<T> {
  // Generic input - can accept ANY array type
  @Input() allItems: T[] = [];
  
  // Specify which properties to search
  @Input() searchProperties: (keyof T)[] = [];
   
  @Input() placeholder: string = 'Search...';
  
  // Emit filtered results
  @Output() searchResults = new EventEmitter<T[]>();

  searchTerm: string = '';

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (term === '') { 
      this.searchResults.emit(this.allItems);
    } else { 
      const filtered = this.allItems.filter((item) => {
        return this.searchProperties.some((prop) => {
          const value = item[prop];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(term);
        });
      });
      this.searchResults.emit(filtered);
    }
  }

  onSearchClick(): void {
    this.onSearchChange();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults.emit(this.allItems);
  }
}