import { Component } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar/sidebar.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  isSidebarOpen$: Observable<boolean>;

  constructor(private sidebarService: SidebarService) {
    this.isSidebarOpen$ = this.sidebarService.isSidebarOpen$;
  }

  close() {
    this.sidebarService.closeSidebar();
  }
}
