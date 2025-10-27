import { Component } from '@angular/core';
import { Header } from '../../../../shared/components/header/header';
import { CartItem } from '../../components/cart-item/cart-item';
import { YellowButton } from '../../../../shared/components/yellow-button/yellow-button';
import { LongYellowButton } from "../../../../shared/components/long-yellow-button/long-yellow-button";

@Component({
  selector: 'app-view-order',
  imports: [Header, CartItem, YellowButton, LongYellowButton],
  templateUrl: './view-order.html',
  styleUrl: './view-order.css'
})
export class ViewOrder {

}
