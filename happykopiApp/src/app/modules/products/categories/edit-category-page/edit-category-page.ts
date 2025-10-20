import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  ngOnInit() {
    this.categories = this.route.snapshot.paramMap.get('categories') || '';
  }

  category: any

  constructor(private route: ActivatedRoute, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.category = nav?.extras.state?.['category'] || { name: '', count: 0 };
  }

}
