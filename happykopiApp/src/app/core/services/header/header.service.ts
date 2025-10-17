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

  private changedInputs = new Set<string>();

  emitAction(action: HeaderAction): void {
    this.actionSource.next(action);
  }

  notifyValueChanged(itemTitle: string, hasChanged: boolean): void {
    if (hasChanged) {
      this.changedInputs.add(itemTitle);
    } else {
      this.changedInputs.delete(itemTitle);
    }
    
    const overallState = this.changedInputs.size > 0;
    this.isValueChange.next(overallState);

    console.log(this.changedInputs);
    console.log("may bagyo? o may bago?", overallState);
  }

  resetValueChangedState(): void {
    this.changedInputs.clear();
    this.isValueChange.next(false);
    console.log("Change state has been reset.");
  }
}
