import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertType, AlertState } from '../../../core/models/alert-state.model';
import { AlertService } from '../../../core/services/alert/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-dialog',
  imports: [CommonModule],
  templateUrl: './alert-dialog.html',
  styleUrl: './alert-dialog.css',
})
export class AlertDialog {
  show = false;
  title = '';
  message = '';
  okText = 'OK';
  alertType: AlertType = 'info';

  private resolve!: () => void;
  private subscription!: Subscription;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.subscription = this.alertService.state$.subscribe((state: AlertState) => {
      this.show = state.show;
      if (this.show) {
        this.title = state.title || '';
        this.message = state.message || '';
        this.alertType = state.alertType || 'info';
        this.okText = state.okText || 'OK';
        this.resolve = state.resolve!;
      }
    });
  }

  onClose(): void {
    if (this.resolve) {
      this.resolve();
    }
    this.show = false;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
