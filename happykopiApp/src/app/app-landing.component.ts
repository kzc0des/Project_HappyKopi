import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  template: `<p class="p-4">Loading...</p>`,
})
export class AppLandingComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const userRole = this.authService.getUserRole();

    switch (userRole?.toLowerCase()) {
      case 'admin':
        this.router.navigate(['/app/products']);
        break;
      case 'barista':
        this.router.navigate(['/app/orders']);
        break;
      default:
        // Fallback if role is not found or unexpected
        this.router.navigate(['/login']);
        break;
    }
  }
}
