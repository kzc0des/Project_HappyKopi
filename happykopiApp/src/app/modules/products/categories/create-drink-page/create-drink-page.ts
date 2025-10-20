import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-drink-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-drink-page.html',
  styleUrl: './create-drink-page.css'
})
export class CreateDrinkPage {
   category: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.category = navigation?.extras?.state?.['category'];
  }
}
