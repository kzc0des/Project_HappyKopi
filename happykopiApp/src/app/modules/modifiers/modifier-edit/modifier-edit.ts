import { Component, OnInit } from '@angular/core';
import { ModifierDetailsDto } from '../../../core/dtos/modifier/modifier-details-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { Itemcard } from '../../../shared/components/itemcard/itemcard';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service';
import { ModifierService } from '../services/modifier.service';

@Component({
  selector: 'app-modifier-edit',
  imports: [Itemcard, FormsModule],
  templateUrl: './modifier-edit.html',
  styleUrl: './modifier-edit.css'
})
export class ModifierEdit implements OnInit {

  modifierDetails !: ModifierDetailsDto
  currentUrl !: string;
  itemTitle !: string;
  actionSubscription !: Subscription

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private confirmationService: ConfirmationService,
    private modifierService: ModifierService
  ) { }

  ngOnInit(): void {
    this.modifierDetails = this.route.snapshot.data['modifierdetail'];
    this.currentUrl = this.router.url;
    this.updateItemTitle(this.currentUrl);

    this.actionSubscription = this.headerService.action$.subscribe(async action => {
      switch (action) {
        case 'SAVE':
          const confirmedSave = await this.confirmationService.confirm(
            'Add Item?',
            `Are you sure you want to save these changes?`,
            'primary',
            'Add Item',
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

  }

  private deleteModifier() {

  }
}
