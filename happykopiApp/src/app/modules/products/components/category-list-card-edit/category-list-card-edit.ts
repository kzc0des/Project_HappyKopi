import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-category-list-card-edit',
  imports: [RouterLink],
  templateUrl: './category-list-card-edit.html',
  styleUrl: './category-list-card-edit.css'
})
export class CategoryListCardEdit {
  @Input() categoryId : number = 0;
  @Input() itemTitle !: string;
  @Input() itemValue !: number;
  @Input() itemUnit !: string;
}
