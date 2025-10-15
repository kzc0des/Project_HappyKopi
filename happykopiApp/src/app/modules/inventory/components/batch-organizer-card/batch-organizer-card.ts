import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-batch-organizer-card',
  imports: [RouterLink],
  templateUrl: './batch-organizer-card.html',
  styleUrl: './batch-organizer-card.css'
})
export class BatchOrganizerCard {
  @Input() name:string = '';
  @Input() batches:number = 0;
  @Input() totalQuantity:number = 0;
  @Input() unitOfMeasurement:string = '';
  @Input() itemId:number = 0;
}
