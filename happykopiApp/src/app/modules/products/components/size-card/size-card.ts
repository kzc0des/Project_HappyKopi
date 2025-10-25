import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-size-card',
  imports: [CommonModule],
  templateUrl: './size-card.html',
  styleUrl: './size-card.css'
})
export class SizeCard {
  @Input() selectedSize: string = ''; 
  @Output() sizeChange = new EventEmitter<string>(); 

  selectSize(size: string) {
    this.selectedSize = size;
    this.sizeChange.emit(size);
  }
}
