import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-category-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-category-page.html',
  styleUrl: './edit-category-page.css'
})
export class EditCategoryPage {
  categories: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.categories = this.route.snapshot.paramMap.get('categories') || '';
  }
}
