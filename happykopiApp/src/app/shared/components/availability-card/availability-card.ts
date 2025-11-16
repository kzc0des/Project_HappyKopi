import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-availability-card',
  imports: [NgClass],
  templateUrl: './availability-card.html',
  styleUrl: './availability-card.css',
})
export class AvailabilityCard {
@Input() isAvailable: boolean = true;
@Input() title: string = 'Available?';

availabilityLabel(): string {
  return this.isAvailable ? 'Available' : 'Not Available';
}
}
