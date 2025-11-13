import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-cash-payment',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-cash-payment.html',
  styleUrl: './dashboard-cash-payment.css'
})
export class DashboardCashPayment {
  @Input() title: string = 'Cash Transactions';
  @Input() count: number = 7;
  @Input() amount: number = 322.5;
}
