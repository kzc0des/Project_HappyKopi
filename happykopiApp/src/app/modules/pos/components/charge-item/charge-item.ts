import { Component, Input } from '@angular/core';

export interface chargeItemDto {
 Name: string,
 Size: string,
 AddOn: string,
 Subtotal: number,
 DrinkQuantity: number,
 AddOnQuantity: number,
} 

@Component({
  selector: 'app-charge-item',
  imports: [],
  templateUrl: './charge-item.html',
  styleUrl: './charge-item.css'
})
export class ChargeItem {
@Input() chargeItem!: chargeItemDto;
}
