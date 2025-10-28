import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-long-yellow-button',
  imports: [],
  templateUrl: './long-yellow-button.html',
  styleUrl: './long-yellow-button.css',
})
export class LongYellowButton {
@Input() buttonTitle!: string;
@Input() buttonSize: 'modal' | 'long' = 'long'
@Input() buttonType: 'cash' | 'gcash' | 'transaction' = 'cash';
}
