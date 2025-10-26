import { Component, OnInit } from '@angular/core';
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { FormsModule } from "@angular/forms";
import { ModifierDetailsDto } from '../../../core/dtos/modifier/modifier-details-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../../core/services/header/header.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modifier-view',
  imports: [Itemcard, FormsModule],
  templateUrl: './modifier-view.html',
  styleUrl: './modifier-view.css'
})
export class ModifierView implements OnInit{

  modifierDetails !: ModifierDetailsDto;
  actionSubscription !: Subscription;

  constructor (
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    this.modifierDetails = this.route.snapshot.data['modifierdetail'];
    this.actionSubscription = this.headerService.action$.subscribe(async action => {
      if(action === 'EDIT'){
        this.router.navigate(['edit'], {relativeTo: this.route});
      }
    })

  }
}
