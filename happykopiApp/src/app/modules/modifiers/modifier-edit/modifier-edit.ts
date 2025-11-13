import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModifierDetailsDto } from '../../../core/dtos/modifier/modifier-details-dto';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Itemcard } from '../../../shared/components/itemcard/itemcard';
import { FormsModule } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service';
import { ModifierService } from '../services/modifier.service';
import { ModifierForUpdate } from '../../../core/dtos/modifier/modifier-for-update.model';
import { Location } from '@angular/common';
import { YellowButton } from '../../../shared/components/yellow-button/yellow-button';

@Component({
  selector: 'app-modifier-edit',
  imports: [Itemcard, FormsModule, YellowButton],
  templateUrl: './modifier-edit.html',
  styleUrl: './modifier-edit.css'
})
export class ModifierEdit implements OnInit, OnDestroy {

  modifierDetails !: ModifierDetailsDto
  currentUrl !: string;
  itemTitle !: string;
  actionSubscription !: Subscription;
  routerSubscription !: Subscription;
  modifierDetailForUpdate !: ModifierForUpdate;

  isDeleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private confirmationService: ConfirmationService,
    private modifierService: ModifierService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.modifierDetails = this.route.snapshot.data['modifierdetail'];
    this.currentUrl = this.router.url;
    this.updateItemTitle(this.currentUrl);

    // Check for the state passed from the modifier-link page
    const navigationState = this.location.getState() as { selectedStockItemId?: number };
    if (navigationState && navigationState.selectedStockItemId) {
      this.modifierService.linkStockItem(this.modifierDetails.id, { stockItemId: navigationState.selectedStockItemId, quantityNeeded: 1 }).subscribe(() => {
        this.reloadModifierDetails();
      });
    }

    this.actionSubscription = this.headerService.action$.subscribe(async action => {
      switch (action) {
        case 'SAVE':
          const confirmedSave = await this.confirmationService.confirm(
            'Save Changes?',
            `Are you sure you want to save these changes?`,
            'primary',
            'Save',
            'Cancel'
          );
          if (confirmedSave) {
            this.updateModfier();
          }
          break;
        case 'DELETE':
          const confirmedDelete = await this.confirmationService.confirm(
            'Delete Item?',
            `Are you sure you want to delete ${this.modifierDetails.name}? This action cannot be undone.`,
            'danger',
            'Delete',
            'Cancel'
          );
          if (confirmedDelete) {
            this.deleteModifier();
          }
          break;
      }
    })
  }

  private reloadModifierDetails() {
    this.modifierService.getModifierById(this.modifierDetails.id).subscribe(details => {
      this.modifierDetails = details;
    });
  }

  linkStockItem() {
    const segments = this.currentUrl.split('/');
    this.router.navigate([...segments, 'link', 'Miscellaneous']);
  }

  async unlinkStockItem(stockItemId: number) {
    const confirmed = await this.confirmationService.confirm(
      'Unlink Item?',
      `Are you sure you want to unlink this stock item?`,
      'danger',
      'Unlink',
      'Cancel'
    );

    if (confirmed) {
      this.modifierService.unlinkStockItem(this.modifierDetails.id, stockItemId).subscribe({
        next: () => this.reloadModifierDetails(),
        error: (err) => console.error('Failed to unlink stock item', err)
      });
    }
  }


  private removeTrailingS(word: string): string {
    return word.endsWith('s') ? word.slice(0, -1) : word;
  }

  private capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  private updateItemTitle(url: string): void {
    const segments = url.split('/');
    if (segments.length > 2) {
      const modifierType = this.removeTrailingS(segments[2]);
      this.itemTitle = `${this.capitalizeFirstLetter(modifierType)} Name`;
    }
  }

  private updateModfier() {

    this.modifierDetailForUpdate = {
      name: this.modifierDetails.name,
      price: this.modifierDetails.price,
      type: this.modifierDetails.type,
      isAvailable: this.modifierDetails.isAvailable,
      ozAmount: this.modifierDetails.ozAmount
    };

    console.log(this.modifierDetails);
    console.log(this.modifierDetailForUpdate);

    this.modifierService.updateModifier(this.modifierDetails.id, this.modifierDetailForUpdate)
      .subscribe({
        next: response => {
          console.log(`Update successful. ${response}`);
          this.location.back();
        },
        error: err => {
          console.error(`Update failed ${err}`);
        }
      })
  }

  private deleteModifier() {
    this.modifierService.deleteModifier(this.modifierDetails.id).subscribe({
      next: response => {
        console.log(`Delete successfully.`);
        this.headerService.notifyItemDeleted(true);
        this.router.navigate(['../../'], { relativeTo: this.route })
      },
      error: err => {
        console.error(`Failed to delete. ${err}`);
        this.isDeleting = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }
}
