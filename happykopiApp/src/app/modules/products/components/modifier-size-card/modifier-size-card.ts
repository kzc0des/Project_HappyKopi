import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modifier-size-card',
  imports: [CommonModule],
  templateUrl: './modifier-size-card.html',
  styleUrl: './modifier-size-card.css',
})
export class ModifierSizeCard {
  @Input() itemName !: string;
  @Input() itemValue : number = 0;
  @Output() notifyClick = new EventEmitter();
  @Input() isSelected: boolean = false;

  clickHandler(): void {
    this.notifyClick.emit();
  }
}
