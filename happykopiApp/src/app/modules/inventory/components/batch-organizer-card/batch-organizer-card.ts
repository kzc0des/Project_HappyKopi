import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-batch-organizer-card',
  templateUrl: './batch-organizer-card.html',
  styleUrl: './batch-organizer-card.css'
})
export class BatchOrganizerCard {
  @Input() name:string = '';
  @Input() batches:number = 0;
  @Input() totalQuantity:number = 0;
  @Input() unitOfMeasurement:string = '';
  @Input() itemId:number = 0;
  @Output() cardClick = new EventEmitter<void>();

  onCardClick() : void {
    this.cardClick.emit();
  }
}
