import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar/sidebar.service';
import { filter, Observable, pipe, Subscription } from 'rxjs';
import { AsyncPipe, Location, TitleCasePipe } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { HeaderService } from '../../../core/services/header/header.service';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, TitleCasePipe],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {

  showAddButton = false;
  showEditButton = false;
  showDeleteButton = false;
  showBackButton = false;

  // under editing state
  isEditing = false;
  showSaveButton = false;
  showCancelButton = false;

  // for labels
  onAdd = false;
  onEdit = false;
  headerTitle!: string | null;
  hasValueChanged = false;

  // for getting the router navigations
  private routerSubscription!: Subscription;

  // detection for itemcard component
  private valueChangeSubscription!: Subscription;

  currentPageSelected: Observable<string>;

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private headerActionService: HeaderService,
    private location: Location) {
    this.currentPageSelected = sidebarService.currentSelectedPage$;
  }

  ngOnInit(): void {

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;
        this.updateHeaderButtons(currentUrl);
        // console.log(currentUrl);
      });

    this.updateHeaderButtons(this.router.url);

    this.valueChangeSubscription = this.headerActionService.isItemCardValueChanged$.subscribe(changed => {
      this.hasValueChanged = changed;
      console.log(changed);
    });
  }

  private updateHeaderButtons(url: string): void {
    this.showAddButton = false;
    this.showDeleteButton = false;
    this.isEditing = false;
    this.showBackButton = false;
    this.headerTitle = null;

    if (url.includes('/inventory/add-item')) {
      this.isEditing = true;
      this.showBackButton = true;
      this.headerTitle = "Add New Item"

      // this.onAdd = true;
      // this.onEdit = false;
    }
    else if (url.includes('/inventory/item/')) {
      this.showDeleteButton = true;
      this.showEditButton = true;

      // this.onEdit = true;
      // this.onAdd = false;
    }
    else if (url.includes('/inventory/') && !url.includes('/item/')) {
      this.showAddButton = true;
      this.showBackButton = true;

      // getting the last link segment
      const urlSegments = url.split('/');

      // console.log(`Url Segment Result: ${urlSegments}`);
      this.headerTitle = decodeURIComponent(urlSegments[urlSegments.length - 1]);
    }
    else if (url.includes('/inventory')) {
      this.showAddButton = true;
    }

    this.headerActionService.resetValueChangedState();
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
    this.showDeleteButton = true;
    this.headerActionService.resetValueChangedState();
  }

  onCancelClick(): void {
    this.isEditing = false;
    this.showDeleteButton = true;
    this.headerActionService.emitAction('CANCEL');
    this.headerActionService.resetValueChangedState();
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

  onBackClick() {
    this.location.back();
  }
}



