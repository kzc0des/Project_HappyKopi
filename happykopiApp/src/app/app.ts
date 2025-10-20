import { Component, NgZone, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { App as CapacitorApp } from '@capacitor/app';
import { SignalRService } from './core/services/signalR/signal-r.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('happykopiApp');

  constructor(
    private router: Router,
    private zone: NgZone,
    private signalrService: SignalRService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      this.zone.run(() => {
        console.log('Back button pressed');
        const currentPageUrl = this.router.url;

        const exitAppPages = [
          '/login',
          '/app/dashboard/admin',
          '/app/dashboard/barista'
        ];
        if (exitAppPages.includes(currentPageUrl)) {
          CapacitorApp.exitApp();
        } else if (canGoBack) {
          window.history.back();
        } else {
          this.router.navigate(['/login']);
        }
      });
    });
  }

  ngOnInit() {
    this.signalrService.startConnection();
  }

  ngOnDestroy() {
    this.signalrService.stopConnection();
  }
}
