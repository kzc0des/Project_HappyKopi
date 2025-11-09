import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trans-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trans-history.html',
  styleUrls: ['./trans-history.css']
})
export class TransHistory {
  @Input() baristaName: string = '';
  @Input() orderId: string = '';
  @Input() orderTime: string = '';
  @Input() paymentMethod: 'cash' | 'gcash' = 'cash';
  @Input() totalPayment: number = 0;
}
