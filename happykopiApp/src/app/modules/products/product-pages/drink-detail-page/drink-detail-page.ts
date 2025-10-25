import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientCard } from '../../components/ingredient-card/ingredient-card';
import { SizeCard } from '../../components/size-card/size-card';
import { ProductsInfoCard } from '../../components/products-info-card/products-info-card';

@Component({
  selector: 'app-drink-detail-page',
  imports: [FormsModule, CommonModule, IngredientCard, SizeCard, ProductsInfoCard],
  templateUrl: './drink-detail-page.html',
  styleUrl: './drink-detail-page.css'
})
export class DrinkDetailPage {
  ingredients = [
    {name: "Milk", unit: "mL", value: 11},
    {name: "Water", unit: "mL", value: 15},
    {name: "Boba", unit: "g", value: 5},
    {name: "Sugar", unit: "tsp", value: 2},
    {name: "Ice", unit: "pcs", value: 10}
  ];

  drink: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.drink = nav?.extras.state?.['drink'];
  }

  selectedSize = 'grande'; 

  onSizeChange(newSize: string) {
    this.selectedSize = newSize;
    console.log('Parent got:', this.selectedSize);
  }

}