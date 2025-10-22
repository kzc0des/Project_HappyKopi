import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-modifier-category-card',
  imports: [RouterLink],
  templateUrl: './modifier-category-card.html',
  styleUrl: './modifier-category-card.css'
})
export class ModifierCategoryCard implements OnInit {
  @Input() itemTitle !: string;
  @Input() itemValue !: number;
  unit !: string;

  ngOnInit(): void {

    if(this.itemTitle.toLowerCase() === 'sizes') {
      this.unit = (this.itemValue > 1) ? 'Sizes' : 'Size'
    }else{
      this.unit = (this.itemValue > 1) ? 'Add-Ons' : 'Add-On'
    }
  }
}
