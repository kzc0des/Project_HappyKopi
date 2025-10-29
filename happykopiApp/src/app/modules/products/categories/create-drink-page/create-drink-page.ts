import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditPhotoCard } from '../../components/edit-photo-card/edit-photo-card';
import { FieldCard } from '../../components/field-card/field-card';
import { SizeCard } from '../../components/size-card/size-card';
import { AddButtonCard } from '../../components/add-button-card/add-button-card';
import { InfoCard } from '../../components/info-card/info-card';

@Component({
  selector: 'app-create-drink-page',
  imports: [CommonModule, FormsModule, EditPhotoCard, FieldCard, SizeCard, AddButtonCard, InfoCard],
  templateUrl: './create-drink-page.html',
  styleUrl: './create-drink-page.css'
})
export class CreateDrinkPage {
   category: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.category = navigation?.extras?.state?.['category'];
  }

  selectedSize: string | null = null;

  selectSize(size: string) {
    this.selectedSize = size;
  }

  drink = {
    name: '',
    baseprice: '',
    category: '',
    available: true
  };
}
