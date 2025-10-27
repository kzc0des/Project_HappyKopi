import { Component, input, Input } from '@angular/core';

export interface paymentMethodDto { 
  Value: number
}

@Component({
  selector: 'app-payment-method-cash',
  imports: [],
  templateUrl: './payment-method-cash.html',
  styleUrl: './payment-method-cash.css'
})
export class PaymentMethodCash {
  @Input() paymentMethod!: paymentMethodDto;
  @Input() mode: 'cash' | 'gcash' = 'cash';

}
