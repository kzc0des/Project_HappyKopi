import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-itemcard',
  imports: [],
  templateUrl: './itemcard.html',
  styleUrl: './itemcard.css'
})
export class Itemcard {
  @Input() itemTitle: string = '';
  @Input() itemName: string = '';
}
