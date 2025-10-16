import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar/sidebar.service';
import { filter, Observable, pipe, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { HeaderService } from '../../../core/services/header/header.service';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {

  showAddButton = false;
  showDeleteButton = false;
  editing = false;

  private routerSubscription!: Subscription;
  currentPageSelected: Observable<string>;

  constructor(private sidebarService: SidebarService, private router: Router, private headerActionService: HeaderService) {
    this.currentPageSelected = sidebarService.currentSelectedPage$;
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;
        this.updateHeaderButtons(currentUrl);
        console.log(currentUrl);
      });

    this.updateHeaderButtons(this.router.url);
  }

  private updateHeaderButtons(url: string): void {
    this.showAddButton = false;
    this.showDeleteButton = false;

    if (url.includes('/inventory/') && !url.includes('/item/')) {
      this.showAddButton = true;
    }
    else if (url.includes('/inventory/item/')) {
      this.showDeleteButton = true;
    }
  }

  onAddItemClick(): void {
    this.headerActionService.emitAction('ADD');
  }

  onEditItemClick(): void {
    this.editing = !this.editing;
    this.headerActionService.emitAction('EDIT');
  }

  onDeleteItemClick(): void {
    this.headerActionService.emitAction('DELETE');
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}



