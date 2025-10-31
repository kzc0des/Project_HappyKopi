import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryWithProductCountDto } from '../../../core/dtos/category/category-with-product-count-dto';
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { YellowButton } from "../../../shared/components/yellow-button/yellow-button";


@Component({
  selector: 'app-edit-category-page',
  imports: [CommonModule, FormsModule, Itemcard, YellowButton],
  templateUrl: './edit-category-page.html',
  styleUrl: './edit-category-page.css'
})
export class EditCategoryPage {
  category !: CategoryWithProductCountDto;

  ngOnInit() {
    this.category = this.route.snapshot.data['categoryDetail'];
  }

  constructor(
    private route: ActivatedRoute, 
    private router: Router) {
  }

   goToCreateDrink() {
    this.router.navigate(['/create-drink-page'], {
      state: { category: this.category }
    });
  }

  goToAssignDrink() {
    this.router.navigate(['/assign-drink-page']);
  }
}
