import { Component } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar/sidebar.service';
import { Observable } from 'rxjs';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { UserDto } from '../../../core/dtos/auth/user-dto';
import { SidebarButton } from "../sidebar-button/sidebar-button";

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe, SidebarButton, TitleCasePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  isSidebarOpen$: Observable<boolean>;
  currentUser:Observable<UserDto | null>;

  selectedPage: Observable<string>;

  pages!:{page: string, route: string}[];

  constructor(private sidebarService: SidebarService, private authService: AuthService, private router: Router) {
    this.isSidebarOpen$ = sidebarService.isSidebarOpen$;
    this.selectedPage = sidebarService.currentSelectedPage$;
    this.currentUser = authService.getCurrentUser$();

    this.pages = [
      {page: 'dashboard', route: 'dashboard'},
      {page: 'order', route: 'dashboard'},
      {page: 'product', route: 'dashboard'},
      {page: 'modifier', route: 'modifiers'},
      {page: 'inventory', route: 'inventory'},
    ];
  }

  close() {
    this.sidebarService.closeSidebar();
  }

  logout() {
    if (confirm("Are you sure you want to end your shift?")) {
      this.authService.logout();
      this.sidebarService.closeSidebar();
      this.router.navigate(['/login']);
    }
  }

  
}
