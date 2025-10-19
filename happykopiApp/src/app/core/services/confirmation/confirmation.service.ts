import { Injectable } from '@angular/core';
import { ConfirmationState, ConfirmButtonType } from '../../models/confirmation-state.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private state = new Subject<ConfirmationState>()
  state$ = this.state.asObservable();

  constructor() { }

  confirm(title: string, message: string, confirmButtonType: ConfirmButtonType = "danger"): Promise<boolean> {
    return new Promise((resolve) => {
      this.state.next({
        show: true,
        title,
        message,
        resolve,
        confirmButtonType
      });
    });
  }
}
