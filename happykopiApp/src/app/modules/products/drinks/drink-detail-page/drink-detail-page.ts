import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-drink-detail-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './drink-detail-page.html',
  styleUrl: './drink-detail-page.css'
})
export class DrinkDetailPage {
  ingredients = [
    {name: "Milk", unit: "mL", value: 10},
    {name: "Water", unit: "mL", value: 15},
    {name: "Boba", unit: "g", value: 5},
    {name: "Sugar", unit: "tsp", value: 2}
  ];

  drink: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.drink = nav?.extras.state?.['drink'];
  }
}