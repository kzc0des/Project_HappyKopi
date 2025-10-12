import { Component } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar/sidebar.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  currentPageSelected: Observable<string>;
  constructor(private sidebarService:SidebarService) {
    this.currentPageSelected = sidebarService.currentSelectedPage$;
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
