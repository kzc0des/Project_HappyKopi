import { Component, OnDestroy } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar/sidebar.service';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { UserDto } from '../../../core/dtos/auth/user-dto';
import { SidebarButton } from "../sidebar-button/sidebar-button";

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe, SidebarButton],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnDestroy{
  isSidebarOpen$: Observable<boolean>;
  selectedPage: Observable<string>;
  
  currentUser$:Observable<UserDto | null>;
  private userSubscription !: Subscription;

  pages!:{page: string, route: string}[];

  constructor(private sidebarService: SidebarService, private authService: AuthService, private router: Router) {
    this.isSidebarOpen$ = sidebarService.isSidebarOpen$;
    this.selectedPage = sidebarService.currentSelectedPage$;
    this.currentUser$ = authService.getCurrentUser$();

    this.userSubscription = this.currentUser$.subscribe(user => {
      if(user && user.role) {
        if(user.role.toLowerCase() === 'admin') {
          this.pages = [
            {page: 'products', route: 'products'},
            {page: 'category', route: 'category'},
            {page: 'modifiers', route: 'modifiers'},
            {page: 'inventory', route: 'inventory'}
          ]
        }else if(user.role.toLowerCase() === 'barista') {
          this.pages = [
            {page: 'orders', route: '/orders'},
            {page: 'transactions', route: '/transactions'}, 
          ]
        }else {
          this.pages = [];
        }
      }else{
        this.pages = []
      }
    })
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

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
