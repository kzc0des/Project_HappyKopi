import { Component, OnInit } from '@angular/core';
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { ModifierForCreateDto } from '../../../core/dtos/modifier/modifier-for-create-dto';
import { ModifierType } from '../../../core/enums/modifier-type';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.updateItemTitle(this.currentUrl);

    this.initializeEmptyDto();
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
}