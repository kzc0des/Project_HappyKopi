import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ConfirmationState } from '../../models/confirmation-state.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private state = new Subject<ConfirmationState>()
  state$ = this.state.asObservable();

  constructor() { }

  confirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.state.next({
        show: true,
        title,
        message,
        resolve
      });
    });
  }
}
