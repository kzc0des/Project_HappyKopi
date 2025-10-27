import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export interface descriptionCardDto {
  Title: string;
  Content: string | number;
}

@Component({
  selector: 'app-description-card',
  imports: [CurrencyPipe],
  templateUrl: './description-card.html',
  styleUrl: './description-card.css',
})
export class DescriptionCard implements OnInit {
  @Input() descriptionType: 'text' | 'money' | "number" = 'text';
  @Input() description!: descriptionCardDto;

  ngOnInit() { 
    this.description = {
      Title: this.description?.Title ?? 'Default Title',
      Content: this.description?.Content ?? (this.descriptionType === 'money' ? 0 : 'No data'),
    };
  }
}
