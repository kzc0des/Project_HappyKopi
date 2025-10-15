import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-batch-organizer-card',
  imports: [],
  templateUrl: './batch-organizer-card.html',
  styleUrl: './batch-organizer-card.css'
})
export class BatchOrganizerCard {
  @Input() name:string = '';
  @Input() batches:number = 0;
  @Input() totalQuantity:number = 0;
  @Input() unitOfMeasurement:string = '';
}
