import { Component, OnInit } from '@angular/core';
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { ModifierForCreateDto } from '../../../core/dtos/modifier/modifier-for-create-dto';
import { ModifierType } from '../../../core/enums/modifier-type';
import { HeaderService } from '../../../core/services/header/header.service';
import { Subscription } from 'rxjs';
import { ModifierService } from '../services/modifier.service';
import { Location } from '@angular/common';
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service';

@Component({
  selector: 'app-modifier-add',
  imports: [Itemcard, FormsModule],
  templateUrl: './modifier-add.html',
  styleUrls: ['./modifier-add.css']
})
export class ModifierAdd implements OnInit {
  modifierDetails!: ModifierForCreateDto;
  itemTitle!: string;
  currentUrl !: string;
  actionSubscription !: Subscription;

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private modifierService: ModifierService,
    private location: Location,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.updateItemTitle(this.currentUrl);

    this.initializeEmptyDto();

    this.actionSubscription = this.headerService.action$.subscribe(async action => {
      if (action === 'SAVE') {
        const confirmation = await this.confirmationService.confirm(
          'Add Item?',
          'Make sure that all the details are correct and complete.',
          'primary',
          'Add Item',
          'Cancel'
        )

        if (confirmation) {
          this.saveNewModifier();
        }
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

  private initializeEmptyDto(): void {
    const type = this.itemTitle.toLowerCase().includes('add-on')
      ? ModifierType.AddOns
      : ModifierType.Sizes;

    this.modifierDetails = {
      name: '',
      price: 0,
      ozAmount: 0,
      type: type
    };
  }

  private saveNewModifier(): void {
    if (!this.modifierDetails.name || !this.modifierDetails.price) {
      alert('Please fill out all required fields.');
      return;
    }


    this.modifierService.createModifier(this.modifierDetails).subscribe({
      next: (response) => {
        console.log('Item created successfully!', response);
        this.location.back();
      },
      error: (err) => {
        if (err.status === 409) {
          alert(`Error: ${err.error.message}`);
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
        console.error('Failed to create item:', err);
      }
    });
  }
}