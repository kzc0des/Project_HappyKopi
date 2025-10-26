import { Component, Input } from '@angular/core';

export interface longYellowButtonDto {
  ButtonTitle: string,
  ButtonType: string
}

@Component({
  selector: 'app-long-yellow-button',
  imports: [],
  templateUrl: './long-yellow-button.html',
  styleUrl: './long-yellow-button.css',
})
export class LongYellowButton {
@Input() longYellowButton!: longYellowButtonDto;
}
