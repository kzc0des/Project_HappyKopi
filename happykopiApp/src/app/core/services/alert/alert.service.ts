import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertState, AlertType } from '../../models/alert-state.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private state = new Subject<AlertState>();
  state$ = this.state.asObservable();

  show(
    title: string,
    message: string,
    alertType: AlertType = 'info',
    okText: string = 'OK'
  ): Promise<void> {
    return new Promise((resolve) => {
      this.state.next({
        show: true,
        title,
        message,
        alertType,
        okText,
        resolve
      });
    });
  }

  showSuccess(title: string, message: string, okText: string = 'OK'): Promise<void> {
    return this.show(title, message, 'success', okText);
  }

  showError(title: string, message: string, okText: string = 'OK'): Promise<void> {
    return this.show(title, message, 'danger', okText);
  }

  showInfo(title: string, message: string, okText: string = 'OK'): Promise<void> {
    return this.show(title, message, 'info', okText);
  }
}
