import { Component } from '@angular/core';
import { OrderQuickView } from '../../components/order-quick-view/order-quick-view';
import { AddonCardActive } from '../../components/addon-card-active/addon-card-active';
import { PosCategoryOn } from '../../components/pos-category-on/pos-category-on';
import { PosCategoryOff } from "../../components/pos-category-off/pos-category-off";
import { SearchDrink } from '../../../../shared/components/search-drink/search-drink';
import { DrinkCard } from '../../../products/components/drink-card/drink-card';
import { OrderCard } from '../../components/order-card/order-card';
import { Header } from '../../../../shared/components/header/header';

@Component({
  selector: 'app-order',
  imports: [OrderQuickView, PosCategoryOn, PosCategoryOff, SearchDrink, OrderCard, Header],
  templateUrl: './order.html',
  styleUrl: './order.css'
})
export class Order {

}
