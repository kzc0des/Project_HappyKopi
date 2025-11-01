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
  @Output() isClick = new EventEmitter<boolean>();

  notifyClickButton() : void {
    this.isClick.emit();
  }
}
