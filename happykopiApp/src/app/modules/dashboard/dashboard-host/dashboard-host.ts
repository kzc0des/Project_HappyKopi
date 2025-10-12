import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-dashboard-host',
  imports: [RouterOutlet],
  templateUrl: './dashboard-host.html',
  styleUrl: './dashboard-host.css'
})
export class DashboardHost implements OnInit{
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
