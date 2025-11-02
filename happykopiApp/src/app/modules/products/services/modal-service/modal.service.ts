import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isAddOnModalOpen = new BehaviorSubject<boolean>(false);
  private isIngredientModalOpen = new BehaviorSubject<boolean>(false);

  public isAddOnModalOpen$ = this.isAddOnModalOpen.asObservable();
  public isIngredientModalOpen$ = this.isIngredientModalOpen.asObservable();

  constructor() {}

  openAddOnModal() : void {
    this.isAddOnModalOpen.next(true);
  }

  closeAddOnModal() : void {
    this.isAddOnModalOpen.next(false);
  }

  openIngredientModal() : void {
    this.isIngredientModalOpen.next(true);
  }

  closeIngredientModal() : void {
    this.isIngredientModalOpen.next(false);
  }
}
