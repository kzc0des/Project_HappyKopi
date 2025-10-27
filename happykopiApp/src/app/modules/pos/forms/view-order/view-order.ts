import { Component } from '@angular/core';
import { CartItem } from '../../components/cart-item/cart-item';
import { LongYellowButton } from "../../../../shared/components/long-yellow-button/long-yellow-button";

@Component({
  selector: 'app-view-order',
  imports: [CartItem, LongYellowButton],
  templateUrl: './view-order.html',
  styleUrl: './view-order.css'
})
export class ViewOrder {

}
