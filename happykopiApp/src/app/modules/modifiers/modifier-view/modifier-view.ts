import { Component, OnInit } from '@angular/core';
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { FormsModule } from "@angular/forms";
import { ModifierDetailsDto } from '../../../core/dtos/modifier/modifier-details-dto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modifier-view',
  imports: [Itemcard, FormsModule],
  templateUrl: './modifier-view.html',
  styleUrl: './modifier-view.css'
})
export class ModifierView implements OnInit{

  modifierDetails !: ModifierDetailsDto;

  constructor (
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
    this.modifierDetails = this.route.snapshot.data['modifierdetail'];
  }
}
