import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-cash-payment',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './dashboard-cash-payment.html',
  styleUrls: ['./dashboard-cash-payment.css']
})
export class DashboardCashPayment {
  @Input() title: string = 'Cash Transactions';
  @Input() count: number = 7;
  @Input() amount: number = 322.5;
}
