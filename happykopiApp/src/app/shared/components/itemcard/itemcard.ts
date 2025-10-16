import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-itemcard',
  imports: [],
  templateUrl: './itemcard.html',
  styleUrl: './itemcard.css'
})
export class Itemcard {
  @Input() itemTitle: string = 'Item Title';
  @Input() value: string | number = '';
  @Input() isEditing: boolean = false;
  @Output() valueChange = new EventEmitter<string>();

  onValueChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
