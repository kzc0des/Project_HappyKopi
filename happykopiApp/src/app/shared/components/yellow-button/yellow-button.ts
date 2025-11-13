import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-yellow-button',
  imports: [],
  templateUrl: './yellow-button.html',
  styleUrl: './yellow-button.css'
})
export class YellowButton {
  @Input() buttonTitle !: string;
  @Input() itemTitle !: string;
  @Input() isDisabled: boolean = false; // Added isDisabled input
  @Output() isClick = new EventEmitter<void>(); // Changed to emit void

  notifyClickButton() : void {
    this.isClick.emit();
  }
}
