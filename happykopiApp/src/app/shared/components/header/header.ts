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
  showMenuButton = true; 

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
  isItemDeleted = false;
  isItemAdded = false;

  // for getting the router navigations
  private routerSubscription!: Subscription;

  // detection for itemcard component
  private valueChangeSubscription!: Subscription;

  // detection for deletion
  private isDeleteItemSubscription!: Subscription;

  private isAddedItemSubscription!: Subscription;

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

    this.isDeleteItemSubscription = this.headerActionService.isItemDeleted$.subscribe(deleted => {
      this.isItemDeleted = deleted;
    });

    this.isAddedItemSubscription = this.headerActionService.isItemAdded$.subscribe(added => {
      this.isItemAdded = added;
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
    this.showMenuButton = true;
    this.onSelected = false;
    this.headerTitle = null;
    this.headerActionService.resetValueChangedState();
  }

  private removeTrailingS(word: string): string {
    return word.endsWith('s') ? word.slice(0, -1) : word;
  }

  private updateHeaderButtons(url: string): void {
    this.resetHeaderState();
    const pathOnly = url.split('?')[0];
    const segments = pathOnly.split('/').filter(segment => segment);

    // Example URL: /app/inventory/liquid/create
    // Segments: ['app', 'inventory', 'liquid', 'create']

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
    else if (segments.includes('batch') && segments.includes('add')) {
      this.headerTitle = 'Add Batch';
      this.showBackButton = true;
      this.showSaveButton = true;
    }
    // Route: ':itemtype/:itemid/batch/:batchid'
    else if (segments.includes('batch') && segments.length >= 6) {
      this.showBackButton = true;
      this.showDeleteButton = true;
      this.onSelected = true;
    }

    else if (segments.includes('inventory') && segments.length === 4) {
      this.showBackButton = true;
      this.showEditButton = true;
      this.onSelected = true;
    }

    else if (segments.includes('inventory') && segments.length === 3) {
      const itemType = segments[2];
      this.headerTitle = itemType;
      this.showBackButton = true;
      this.showAddButton = true;
    }
    // Route: '' (main inventory page)
    else if (segments.includes('inventory') && segments.length === 2) {
      this.headerTitle = 'Inventory';
      this.showBackButton = false;
    }

    /* modifiers routing */

    else if (segments.includes('modifiers') && segments.includes('edit') && segments.length >= 5) {
      this.showBackButton = true;
      this.showSaveButton = true;
      this.showDeleteButton = true;
      this.onSelected = true;
    }

    else if (segments.includes('modifiers') && segments.includes('create') && segments.length >= 4) {
      const itemType = this.removeTrailingS(segments[2]);
      this.headerTitle = `Create ${itemType}`;
      this.showBackButton = true;
      this.showSaveButton = true;
    }

    else if (segments.includes('modifiers') && segments.length === 4) {
      this.showBackButton = true;
      this.showEditButton = true;
      this.onSelected = true;
    }

    else if (segments.includes('modifiers') && segments.length === 3) {
      const modifierType = segments[2]
      this.headerTitle = modifierType
      this.showBackButton = true;
      this.showAddButton = true;
    }

    /* category routing */

    else if (segments.includes('category') && segments.length === 2) {
      this.showAddButton = true;
    }

    else if (segments.includes('category') && segments.length === 3) {
      this.showBackButton = true;
      this.showSaveButton = true;
      this.showDeleteButton = true;
      this.onSelected = true;
    }

    else if (segments.includes('category') && segments.includes('assign') && segments.length === 4) {
      this.headerTitle = `Assign to Category`;
      this.showBackButton = true;
      this.showSaveButton = true;
    }

    /* products routing */
    else if (segments.includes('products') && segments.includes('edit') && segments.length >= 5) {
      this.showBackButton = true;
      this.onSelected = true;
      this.showSaveButton = true;
      this.showDeleteButton = true;
    }

    else if (segments.includes('products') && segments.length === 2) {
      this.headerTitle = 'Products';
      this.showAddButton = true;
    }

    else if (segments.includes('products') && segments.length === 3) {
      this.headerTitle = 'Create Drink';
      this.showBackButton = true;
    }

    else if (segments.includes('products') && segments.includes('drink') && segments.length >= 4) {
      this.showBackButton = true;
      this.showEditButton = true;
      this.onSelected = true;
    }

        /* orders routing */
    else if (segments.includes('orders') && segments.includes('cart') && segments.length === 3) {
      this.headerTitle = 'Your Cart';
      this.showBackButton = true;
    }

    else if (segments.includes('orders') && segments.includes('summary') && segments.length === 3) {
      this.headerTitle = 'Order Summary';
      this.showBackButton = false;
      this.showMenuButton = false; 
    }

    else if (segments.includes('orders') && segments.length === 2) {
      this.headerTitle = 'Order';
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
    if (!this.isItemDeleted && !this.hasValueChanged && !this.isItemAdded) {
      this.location.back();
    }

    if (this.hasValueChanged) {
      const confirmation = await this.confirmationService.confirm(
        "Cancel Edit?",
        "All the changes will not be saved.",
        "primary",
        'Yes, Go Back',
        'Stay'
      )

      if (confirmation) {
        this.location.back();
      }
    }

    this.headerActionService.emitAction('BACK');
  }

}
