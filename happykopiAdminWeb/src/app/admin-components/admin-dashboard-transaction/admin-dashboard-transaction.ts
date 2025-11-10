import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard-transaction',
  templateUrl: './admin-dashboard-transaction.html',
  styleUrls: ['./admin-dashboard-transaction.css']
})
export class AdminDashboardTransaction {

  @Input() value: string = '14';
  @Input() subtitle: string = 'Transactions';
}
