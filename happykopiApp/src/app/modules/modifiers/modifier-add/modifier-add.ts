import { Component, OnInit } from '@angular/core';
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { FormsModule } from "@angular/forms";
import { filter, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { ModifierForCreateDto } from '../../../core/dtos/modifier/modifier-for-create-dto';
import { ModifierType } from '../../../core/enums/modifier-type';

@Component({
  selector: 'app-modifier-add',
  imports: [Itemcard, FormsModule],
  templateUrl: './modifier-add.html',
  styleUrl: './modifier-add.css'
})
export class ModifierAdd implements OnInit {
  modifierDetails !: ModifierForCreateDto;
  routerSubscription !: Subscription;
  itemTitle!: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initializeEmptyDto();

    this.routerSubscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const currentUrl = e.urlAfterRedirects;
        console.log(currentUrl);
      })
    
  }

  private initializeEmptyDto(): void {
    this.modifierDetails = {
      name: '',
      price: 0,
      ozAmount: 0,
      type: (this.itemTitle === 'add-ons') ? ModifierType.AddOns : ModifierType.Sizes
    }
  }
}
