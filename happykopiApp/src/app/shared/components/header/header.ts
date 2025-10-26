import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar/sidebar.service';
import { filter, Observable, pipe, Subscription } from 'rxjs';
import { AsyncPipe, Location, TitleCasePipe } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { HeaderService } from '../../../core/services/header/header.service';
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, TitleCasePipe],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {

  showAddButton = false;
  showEditButton = false;
  showBackButton = false;

  // under editing state
  isEditing = false;
  showSaveButton = false;
  showDeleteButton = false;

  // for labels
  onAdd = false;
  onEdit = false;
  onSelected = false;

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
    private location: Location,
    private confirmationService: ConfirmationService
  ) {
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
      // console.log(changed);
    });

    console.log(`show back button state: ${this.showBackButton}`);
    console.log(`show isEditing state: ${this.isEditing}`);
  }

private resetHeaderState(): void {
    this.showAddButton = false;
    this.showEditButton = false;
    this.showBackButton = false;
    this.showSaveButton = false;
    this.showDeleteButton = false;
    this.onSelected = false;
    this.headerTitle = null;
    this.headerActionService.resetValueChangedState();
  }

  private updateHeaderButtons(url: string): void {
    this.resetHeaderState();
    const segments = url.split('/').filter(segment => segment); // Clean empty segments

    // Example URL: /app/inventory/drinks/create
    // Segments: ['app', 'inventory', 'drinks', 'create']

    // Most specific routes first
    // Route: ':itemType/:itemId/edit'
    if (segments.includes('inventory') && segments.includes('edit') && segments.length >= 5) {
      this.showBackButton = true;
      this.showSaveButton = true;
      this.showDeleteButton = true;
      this.onSelected = true;
    }
    // Route: ':itemType/create'
    else if (segments.includes('inventory') && segments.includes('create') && segments.length >= 4) {
      this.headerTitle = 'Add Ingredient';
      this.showBackButton = true;
      this.showSaveButton = true;
    }
    // Route: 'item/:itemid/batch/add'
    else if (segments.includes('item') && segments.includes('batch') && segments.includes('add')) {
      this.headerTitle = 'Add Batch';
      this.showBackButton = true;
      this.showSaveButton = true;
    }
    // Route: 'item/:itemid/batch/:batchid'
    else if (segments.includes('item') && segments.includes('batch') && segments.length >= 5) {
      this.showBackButton = true;
      this.showEditButton = true;
    }
    // Route: ':itemType/:itemId'
    else if (segments.includes('inventory') && segments.length === 4) {
      this.showBackButton = true;
      this.showEditButton = true;
      this.onSelected = true;
    }
    // Route: ':itemType' (e.g., /inventory/drinks)
    else if (segments.includes('inventory') && segments.length === 3) {
      const itemType = segments[2];
      this.headerTitle = itemType; // Automatically sets title like "drinks"
      this.showBackButton = true;
      this.showAddButton = true;
    }
    // Route: '' (main inventory page)
    else if (segments.includes('inventory') && segments.length === 2) {
      this.headerTitle = 'Inventory';
      this.showBackButton = false;
    }
  }

  onAddItemClick(): void {
    this.headerActionService.emitAction('ADD');

    this.showBackButton = true;
    this.showSaveButton = true;

  }

  onEditItemClick(): void {
    this.showDeleteButton = false;
    this.headerActionService.emitAction('EDIT');

    this.showDeleteButton = true;
    this.showSaveButton = true;
    this.showBackButton = true;
    this.showEditButton = false;
  }

  onSaveItemClick(): void {
    this.headerActionService.emitAction('SAVE');
    this.headerActionService.resetValueChangedState();

    this.showEditButton = false;
  }

  onCancelClick(): void {
    this.showDeleteButton = true;
    this.headerActionService.emitAction('CANCEL');
    this.headerActionService.resetValueChangedState();

    this.showEditButton = true;
    this.showSaveButton = false;
    this.showDeleteButton = false;
  }

  onDeleteItemClick(): void {
    this.headerActionService.emitAction('DELETE');
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

  async onBackClick() {
    if (!this.hasValueChanged) {
      this.location.back();
    } else {
      const confirmed = await this.confirmationService.confirm(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?'
      );

      if (confirmed) {
        this.location.back();
      }
    }
  }

}



