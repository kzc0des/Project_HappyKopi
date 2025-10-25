import { CommonModule } from '@angular/common';
import {  Component, Input, Output, EventEmitter } from '@angular/core';
import { CompilerOptions } from '@angular/core';

@Component({
  selector: 'app-add-button-card',
  imports: [CommonModule],
  templateUrl: './add-button-card.html',
  styleUrl: './add-button-card.css'
})
export class AddButtonCard {
  @Input() label: string = 'Add Item';
  @Input() icon: string = 'add';      
  @Input() bgColor: string = '#EDEDED'; 
  @Input() textColor: string = '#1f2937';
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
