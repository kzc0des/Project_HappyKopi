import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private isSidebarOpen = new BehaviorSubject<boolean>(false);
  public isSidebarOpen$ = this.isSidebarOpen.asObservable();

  constructor() { }

  openSidebar() {
    this.isSidebarOpen.next(true);
  }

  closeSidebar() {
    this.isSidebarOpen.next(false);
  }

  toggleSidebar() {
    this.isSidebarOpen.next(!this.isSidebarOpen.value);
  }
}
