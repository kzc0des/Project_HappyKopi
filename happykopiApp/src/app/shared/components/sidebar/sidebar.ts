import { Component, OnDestroy } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar/sidebar.service';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { UserDto } from '../../../core/dtos/auth/user-dto';
import { SidebarButton } from "../sidebar-button/sidebar-button";
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service'; // Import ConfirmationService
import { LoadingService } from '../../../core/services/loading/loading.service'; // Import LoadingService

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

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService, // Inject ConfirmationService
    private loadingService: LoadingService // Inject LoadingService
  ) {
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
            {page: 'inventory', route: 'inventory'},
            {page: 'register barista', route: 'register-barista'}
          ]
        }else if(user.role.toLowerCase() === 'barista') {
          this.pages = [
            {page: 'orders', route: 'orders'},
            {page: 'transactions', route: 'transactions'}, 
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

  async logout() { // Make the method async to use await
    const confirmed = await this.confirmationService.confirm(
      'Confirm Sign Out',
      'Are you sure you want to end your shift?',
      'danger', // Using 'danger' type for a sign-out action
      'Sign Out',
      'Cancel'
    );

    if (confirmed) {
      this.loadingService.show(); // Show loading spinner
      try {
        this.authService.logout();
        this.sidebarService.closeSidebar();
        await this.router.navigate(['/login']); // Use await for navigation
      } finally {
        this.loadingService.hide(); // Hide loading spinner regardless of success or failure
      }
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
