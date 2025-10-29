import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-info-card',
  imports: [CommonModule],
  templateUrl: './info-card.html',
  styleUrl: './info-card.css'
})
export class InfoCard {
  @Input() label: string = '';  
  @Input() value: string = '';  
  @Input() iconColor: string = '#F3B72C'; 
}
