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
  @Input() itemName !: string;
  @Output() notifyClick = new EventEmitter<void>();
  @Input() isDisabled !: boolean;

  onClick() {
    this.notifyClick.emit();
  }
}
