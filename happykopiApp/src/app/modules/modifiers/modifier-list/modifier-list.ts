import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModifierSummaryDto } from '../../../core/dtos/modifier/modifier-summary-dto';
import { ModifierItemCard } from '../components/modifier-item-card/modifier-item-card';
import { HeaderService } from '../../../core/services/header/header.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modifier-list',
  imports: [ModifierItemCard],
  templateUrl: './modifier-list.html',
  styleUrl: './modifier-list.css'
})
export class ModifierList implements OnInit{

  modifiersItem !: ModifierSummaryDto[];
  actionSubscription !: Subscription;
  
  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.modifiersItem = this.route.snapshot.data['modifierlist'];

    this.actionSubscription = this.headerService.action$.subscribe(action => {
      if(action === 'ADD'){
        this.router.navigate(['create'], {relativeTo: this.route})
      }
    })
  }
}
