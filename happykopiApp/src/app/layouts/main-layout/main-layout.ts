import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from "../../shared/components/header/header";
import { Sidebar } from "../../shared/components/sidebar/sidebar";
import { ConfirmationDialog } from "../../shared/components/confirmation-dialog/confirmation-dialog";
import { AlertDialog } from "../../shared/components/alert-dialog/alert-dialog";
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";
import { AuthService } from '../../core/services/auth/auth.service';
import { SignalRService } from '../../core/services/signalR/signal-r.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar, ConfirmationDialog, AlertDialog, LoadingSpinner],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnInit{
  constructor (private router: Router, private authService: AuthService, private signalRService: SignalRService) {}
  
  ngOnInit(): void {
    // When the main layout loads, immediately redirect based on role.
    // This is especially useful for handling the initial navigation to '/app'.
    if (this.router.url === '/app' || this.router.url === '/app/') {
      const userRole = this.authService.getUserRole();
      switch (userRole?.toLowerCase()) {
        case 'admin':
          this.router.navigate(['/app/products']);
          break;
        case 'barista':
          this.router.navigate(['/app/orders']);
          break;
        default:
          this.router.navigate(['/login']); // Fallback to login if role is unknown
          break;
      }
    }

    this.signalRService.startConnection();
  }
}
