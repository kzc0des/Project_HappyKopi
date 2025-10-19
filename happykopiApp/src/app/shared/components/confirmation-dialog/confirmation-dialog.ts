import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service';
import { ConfirmationState } from '../../../core/models/confirmation-state.model';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css'
})
export class ConfirmationDialog implements OnInit, OnDestroy {

  show = false;
  title = 'Are you sure?';
  message = 'Do you really want to perform this action?';
  confirmText = 'Yes';
  cancelText = 'No';

  private resolve!: (value: boolean) => void;
  private subscription!: Subscription;

  constructor(private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.subscription = this.confirmationService.state$.subscribe((state: ConfirmationState) => {
      this.show = state.show;
      if (this.show) {
        this.title = state.title;
        this.message = state.message;
        this.resolve = state.resolve;
      }
    });
  }

  onConfirm(): void {
    this.resolve(true);
    this.show = false;
  }

  onCancel(): void {
    this.resolve(false);
    this.show = false;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
