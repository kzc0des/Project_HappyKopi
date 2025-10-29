import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-action-button',
  imports: [CommonModule],
  templateUrl: './action-button.html',
  styleUrl: './action-button.css'
})
export class ActionButton {
  @Input() label: string = ''; 
  @Input() icon?: string; 
  @Input() bgColor: string = '#F3B72C'; 
  @Input() textColor: string = '#6A4700'; 
  @Input() disabled: boolean = false; 
  
  @Output() clicked = new EventEmitter<void>();

  handleClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
