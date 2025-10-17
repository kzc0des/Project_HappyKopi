import { Component } from '@angular/core';
import { Header } from '../../../../shared/components/header/header';
import { CartItem } from '../../components/cart-item/cart-item';

@Component({
  selector: 'app-view-order',
  imports: [Header, CartItem],
  templateUrl: './view-order.html',
  styleUrl: './view-order.css'
})
export class ViewOrder {

}
