import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModifierSummaryDto } from '../../../core/dtos/modifier/modifier-summary-dto';
import { ModifierItemCard } from '../components/modifier-item-card/modifier-item-card';
import { HeaderService } from '../../../core/services/header/header.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modifier-list',
  imports: [ModifierItemCard],
  templateUrl: './modifier-list.html',
  styleUrl: './modifier-list.css'
})
export class ModifierList implements OnInit {

  modifiersItem !: ModifierSummaryDto[];
  actionSubscription !: Subscription;
  isDeleteSubscription !: Subscription;
  isDeleted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.modifiersItem = this.route.snapshot.data['modifierlist'];
    console.log(`is deleted: ${this.isDeleted}`);

    this.isDeleteSubscription = this.headerService.isItemDeleted$.subscribe(isdel => {
      this.isDeleted = isdel;
      console.log(isdel);
    })

    this.actionSubscription = this.headerService.action$.subscribe(action => {
      if (action === 'ADD') {
        this.router.navigate(['create'], { relativeTo: this.route })
      }

      else if (action === 'BACK') {
        if (this.isDeleted) {
          this.router.navigate(['../'], {relativeTo: this.route});
        }
      }
    })
  }
}
