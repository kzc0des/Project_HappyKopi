import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserDto } from '../../../core/dtos/auth/user-dto';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-host',
  imports: [RouterOutlet],
  templateUrl: './dashboard-host.html',
  styleUrl: './dashboard-host.css'
})
export class DashboardHost implements OnInit{
  private userSubscription?: Subscription;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUser$().pipe(
      filter((user): user is UserDto => user !== null)
    ).subscribe(user => {
      const userRole = user.role;

      if (userRole === 'Admin') {
        this.router.navigate(['/app/dashboard/admin'], { replaceUrl: true });
      } else if (userRole === 'Barista') {
        this.router.navigate(['/app/dashboard/barista'], { replaceUrl: true });
      } else {
        this.router.navigate(['/login']);
      }
    });

    setTimeout(() => {
        if (!this.authService.getUserRole()) {
            const token = localStorage.getItem('token');
            if(!token) {
              this.router.navigate(['/login']);
            }
        }
    }, 500); 
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
