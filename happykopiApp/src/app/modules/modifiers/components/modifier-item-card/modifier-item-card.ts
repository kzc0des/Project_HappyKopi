import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modifier-item-card',
  imports: [CurrencyPipe],
  templateUrl: './modifier-item-card.html',
  styleUrl: './modifier-item-card.css'
})
export class ModifierItemCard {
@Input() itemTitle !: string;
@Input() itemValue !: number;
@Input() itemId !: number;
}
