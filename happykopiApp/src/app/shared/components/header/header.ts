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
  isEditing = false;
  hasValueChanged = false;

  private routerSubscription!: Subscription;
  private valueChangeSubscription!: Subscription;
  private cancelButtonSubscription!: Subscription;

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

    this.valueChangeSubscription = this.headerActionService.isValueChanged$.subscribe(changed => {
      this.hasValueChanged = changed;
    });
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

    this.isEditing = false; 
    this.headerActionService.notifyValueChanged(false);
  }

  onAddItemClick(): void {
    this.headerActionService.emitAction('ADD');
  }

  onEditItemClick(): void {
    this.isEditing = !this.isEditing;
    this.showDeleteButton = false;
    this.headerActionService.emitAction('EDIT');
  }

  onDeleteItemClick(): void {
    this.headerActionService.emitAction('DELETE');
  }

  onSaveItemClick(): void {
    this.headerActionService.emitAction('SAVE');
    this.isEditing = false;
    this.headerActionService.notifyValueChanged(false);
  }

  onCancelClick(): void {
    this.isEditing = false;
    this.showDeleteButton = true;
    this.headerActionService.emitAction('CANCEL');
    this.headerActionService.notifyValueChanged(false); 
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}



