import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface sizeButtonDto {
  SizeName: string,
  SizeQuantity: number
}

@Component({
  selector: 'app-grande-active', 
  imports: [CommonModule],
  templateUrl: './grande-active.html',
  styleUrl: './grande-active.css'
})
export class GrandeActive {
  isActive = false;
  @Input() sizeButton!: sizeButtonDto

  toggleActive() {
    this.isActive = !this.isActive;
  }
}
