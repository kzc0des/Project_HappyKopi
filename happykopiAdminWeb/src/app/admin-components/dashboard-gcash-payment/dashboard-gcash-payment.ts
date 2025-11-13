import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-gcash-payment',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-gcash-payment.html',
  styleUrls: ['./dashboard-gcash-payment.css']
})
export class DashboardGcashPayment {
  @Input() title: string = 'G-Cash Transactions';
  @Input() count: number = 0;
  @Input() amount: number = 0;
  @Input() color: string = '#F3B72C';
}
