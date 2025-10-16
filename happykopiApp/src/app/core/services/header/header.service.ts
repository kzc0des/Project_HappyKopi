import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type HeaderAction = 'ADD' | 'DELETE' | 'EDIT' | 'SAVE' | 'CANCEL';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private actionSource = new Subject<HeaderAction>();
  public action$ = this.actionSource.asObservable();

  emitAction(action: HeaderAction): void {
    this.actionSource.next(action);
  }
}
