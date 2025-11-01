import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-red-button',
  imports: [],
  templateUrl: './red-button.html',
  styleUrl: './red-button.css',
})
export class RedButton {
  @Input() buttonTitle !: string;
  @Input() itemTitle !: string;
  @Output() isClick = new EventEmitter<boolean>();

  notifyClickButton(): void {
    this.isClick.emit();
  }
}
