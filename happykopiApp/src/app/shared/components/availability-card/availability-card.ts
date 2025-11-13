import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-availability-card',
  imports: [],
  templateUrl: './availability-card.html',
  styleUrl: './availability-card.css',
})
export class AvailabilityCard {
@Input() isAvailable: boolean = true;
@Input() title: string = 'Available?';
}
