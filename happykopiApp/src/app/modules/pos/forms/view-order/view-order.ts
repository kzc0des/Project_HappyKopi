import { Component } from '@angular/core';
import { Header } from '../../../../shared/components/header/header';
import { CartItem } from '../../components/cart-item/cart-item';
import { YellowButton } from '../../../../shared/components/yellow-button/yellow-button';

@Component({
  selector: 'app-view-order',
  imports: [Header, CartItem, YellowButton],
  templateUrl: './view-order.html',
  styleUrl: './view-order.css'
})
export class ViewOrder {

}
