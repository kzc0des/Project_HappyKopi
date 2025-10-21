import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modifier-page',
  imports: [],
  templateUrl: './modifier-page.html',
  styleUrl: './modifier-page.css'
})
export class ModifierPage implements OnInit{

  constructor (
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  const datalist = this.route.snapshot.data['modifiertypecount'];
  console.log(datalist);
  }
}
