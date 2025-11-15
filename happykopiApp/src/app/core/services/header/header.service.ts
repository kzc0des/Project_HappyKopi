import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export type HeaderAction = 'ADD' | 'DELETE' | 'EDIT' | 'SAVE' | 'CANCEL' | 'BACK' | 'RESTORE' | 'SHOW_RESTORE' | 'HIDE_RESTORE';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private actionSource = new Subject<HeaderAction>();
  public action$ = this.actionSource.asObservable();

  private isValueChange = new BehaviorSubject<boolean>(false);
  public isItemCardValueChanged$ = this.isValueChange.asObservable();

  private isDelete = new BehaviorSubject<boolean>(false);
  public isItemDeleted$ = this.isDelete.asObservable();

  private isAdded = new BehaviorSubject<boolean>(false);
  public isItemAdded$ = this.isAdded.asObservable();

  // --- START: ADDED FOR ARCHIVE TOGGLE ---
  private toggleArchivedViewSource = new Subject<void>();
  toggleArchivedView$ = this.toggleArchivedViewSource.asObservable();

  private isArchivedViewStatusSource = new BehaviorSubject<boolean>(false);
  isArchivedViewStatus$ = this.isArchivedViewStatusSource.asObservable();
  // --- END: ADDED FOR ARCHIVE TOGGLE ---

  private titleSource = new Subject<string>();
  title$ = this.titleSource.asObservable();
  private changedInputs = new Set<string>();

  emitAction(action: HeaderAction): void {
    this.actionSource.next(action);
  }

  resetAction(): void {
    this.actionSource.next(undefined as any); 
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

  notifyItemDeleted(status: boolean): void {
    this.isDelete.next(status);
  }

  notifyItemAdded(status: boolean): void {
    this.isAdded.next(status);
  }

  resetValueChangedState(): void {
    this.changedInputs.clear();
    this.isValueChange.next(false);
    // console.log("Change state has been reset.");
  }

  // --- START: ADDED FOR ARCHIVE TOGGLE ---
  emitToggleArchivedView() {
    this.toggleArchivedViewSource.next();
  }

  setArchivedViewStatus(isArchived: boolean) {
    this.isArchivedViewStatusSource.next(isArchived);
  }
  // --- END: ADDED FOR ARCHIVE TOGGLE ---

  updateTitle(title: string) {
    this.titleSource.next(title);
  }
}
