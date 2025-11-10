import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  templateUrl: './dashboard-card.html',
  styleUrls: ['./dashboard-card.css'],
})
export class DashboardCard {

  @Input() amount: string = '₱0.00';
  @Input() title: string = 'Sales';
}
