import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class DashboardHostModule implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    const userRole = this.authService.getUserRole();

    if (userRole === 'Admin') {
      this.router.navigate(['/app/dashboard/admin'], { replaceUrl: true });
    } else if (userRole === 'Barista') {
      this.router.navigate(['/app/dashboard/barista'], { replaceUrl: true });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
