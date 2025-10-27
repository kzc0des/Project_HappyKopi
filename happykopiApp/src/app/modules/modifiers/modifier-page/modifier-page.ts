import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModifierCount } from '../../../core/dtos/modifier/modifier-count.model';
import { ModifierCategoryCard } from "../components/modifier-category-card/modifier-category-card";

@Component({
  selector: 'app-modifier-page',
  imports: [ModifierCategoryCard],
  templateUrl: './modifier-page.html',
  styleUrl: './modifier-page.css'
})
export class ModifierPage implements OnInit {

  modifierRaw !: ModifierCount[];
  modifierDisplay: ModifierCount[] = [
    {
      modifierType: 'Size', 
      modifierCount: 0
    },
    {
      modifierType: 'AddOn',
      modifierCount: 0
    }
  ];

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.modifierRaw = this.route.snapshot.data['modifiertypecount'];
    
    this.modifierDisplay.forEach(data => {
      const target = this.modifierRaw.find(t => t.modifierType.toLowerCase() === data.modifierType.toLowerCase());
      if(target){
        data.modifierCount = target.modifierCount;
      }
    })
  }
}