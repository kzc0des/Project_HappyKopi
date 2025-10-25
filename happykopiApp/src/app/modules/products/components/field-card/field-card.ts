import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-field-card',
  imports: [],
  templateUrl: './field-card.html',
  styleUrl: './field-card.css'
})
export class FieldCard {
  @Input() label!: string;          
  @Input() value: any;           
  @Input() placeholder: string = '';

  @Output() valueChange = new EventEmitter<string>();

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}
