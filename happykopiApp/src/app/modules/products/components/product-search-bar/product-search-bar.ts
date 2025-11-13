import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-search-bar',
  imports: [],
  templateUrl: './product-search-bar.html',
  styleUrl: './product-search-bar.css',
})
export class ProductSearchBar {
  @Output() searchChange = new EventEmitter<string>();

  onSearch(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
