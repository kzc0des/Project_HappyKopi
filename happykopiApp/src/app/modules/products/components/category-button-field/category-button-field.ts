import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-button-field',
  imports: [],
  templateUrl: './category-button-field.html',
  styleUrl: './category-button-field.css'
})
export class CategoryButtonField {
    constructor(private router: Router) {}

    goToCategory() {
    this.router.navigate(['/categories-list-page'])
  }

}

