import { Component } from '@angular/core';
import { AddonCardInactive } from '../../components/addon-card-inactive/addon-card-inactive';
import { AddonCardActive } from "../../components/addon-card-active/addon-card-active";

@Component({
  selector: 'app-add-order-modal',
  imports: [AddonCardActive],
  templateUrl: './add-order-modal.html',
  styleUrl: './add-order-modal.css'
})
export class AddOrderModal {

}
