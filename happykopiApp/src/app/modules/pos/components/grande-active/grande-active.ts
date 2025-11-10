import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface sizeButtonDto {
  SizeName: string,
  SizeQuantity: number,
}

@Component({
  selector: 'app-grande-active', 
  imports: [CommonModule],
  templateUrl: './grande-active.html',
  styleUrl: './grande-active.css'
})
export class GrandeActive {
  @Input() sizeButton!: sizeButtonDto;
  @Input() isActive = false;   // <-- now controlled by parent
  @Output() selected = new EventEmitter<void>(); // emit click to parent

  handleClick() {
    this.selected.emit();
  }
}
