import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-list-card-edit',
  imports: [],
  templateUrl: './category-list-card-edit.html',
  styleUrl: './category-list-card-edit.css'
})
export class CategoryListCardEdit {
  @Input() itemTitle !: string;
  @Input() itemValue !: number;
  @Input() itemUnit !: string;
}
