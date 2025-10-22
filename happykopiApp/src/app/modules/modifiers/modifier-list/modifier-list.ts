import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModifierSummaryDto } from '../../../core/dtos/modifier/modifier-summary-dto';
import { ModifierItemCard } from '../components/modifier-item-card/modifier-item-card';

@Component({
  selector: 'app-modifier-list',
  imports: [ModifierItemCard],
  templateUrl: './modifier-list.html',
  styleUrl: './modifier-list.css'
})
export class ModifierList implements OnInit{

  modifiersItem !: ModifierSummaryDto[];
  
  constructor (
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.modifiersItem = this.route.snapshot.data['modifierlist'];
  }
}
