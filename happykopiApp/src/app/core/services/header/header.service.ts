import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export type HeaderAction = 'ADD' | 'DELETE' | 'EDIT' | 'SAVE' | 'CANCEL';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private actionSource = new Subject<HeaderAction>();
  public action$ = this.actionSource.asObservable();

  private isValueChange = new BehaviorSubject<boolean>(false);
  public isValueChanged$ = this.isValueChange.asObservable();

  emitAction(action: HeaderAction): void {
    this.actionSource.next(action);
  }

  notifyValueChanged(hasChanged: boolean): void {
    this.isValueChange.next(hasChanged);
    console.log("may bagyo? o may bago?", hasChanged)
  }
}
