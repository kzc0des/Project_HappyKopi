import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-date-card',
  imports: [DatePipe],
  templateUrl: './date-card.html',
  styleUrl: './date-card.css'
})
export class DateCard {
@Input() itemTitle !: string;
@Input() itemValue !: Date;
}
