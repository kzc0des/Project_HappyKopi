import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service';
import { ConfirmationState, ConfirmButtonType } from '../../../core/models/confirmation-state.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css'
})
export class ConfirmationDialog implements OnInit, OnDestroy {
  
  show = false;
  title = 'Delete Item?';
  message = 'This will be permanently removed to your system.';
  confirmText = 'Delete';
  cancelText = 'Cancel';
  confirmButtonType: ConfirmButtonType = 'danger';

  private resolve!: (value: boolean) => void;
  private subscription!: Subscription;

  constructor(private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.subscription = this.confirmationService.state$.subscribe((state: ConfirmationState) => {
      this.show = state.show;
      if (this.show) {
        this.title = state.title;
        this.message = state.message;
        this.confirmButtonType = state.confirmButtonType;
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
