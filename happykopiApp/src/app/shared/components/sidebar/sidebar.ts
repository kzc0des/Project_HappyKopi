import { Component } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar/sidebar.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  isSidebarOpen$: Observable<boolean>;
  currentUser:string = '';

  selectedPage: Observable<string>;

  constructor(private sidebarService: SidebarService, private authService: AuthService, private router: Router) {
    this.isSidebarOpen$ = sidebarService.isSidebarOpen$;
    this.selectedPage = sidebarService.currentSelectedPage$;
  }

  close() {
    this.sidebarService.closeSidebar();
  }

  logout() {
    const isConfirmed = confirm("Are you sure you want to end your shift?");
    if (isConfirmed) {
      this.authService.logout();
      this.sidebarService.closeSidebar();
      this.router.navigate(['/login']);
    }
  }

  selectPage(page:string) {
    this.sidebarService.selectPage(page);
    this.close();
  }
}
