import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AddButtonCard } from '../../components/add-button-card/add-button-card';

import { Itemcard } from '../../../../shared/components/itemcard/itemcard';
import { DropdownButton } from '../../../../shared/components/dropdown-button/dropdown-button';
import { ModifierSizeCard } from "../../components/modifier-size-card/modifier-size-card";
import { AddIngredientModal } from "../../components/add-ingredient-modal/add-ingredient-modal";
import { ModalService } from '../../services/modal-service/modal.service';
import { AddAddonModal } from "../../components/add-addon-modal/add-addon-modal";


export interface ModifierSize {
  id: number;
  name: string;
  ozAmount: number;
}

@Component({
  selector: 'app-add-drink-page',
  imports: [
    FormsModule,
    CommonModule,
    AddButtonCard,
    Itemcard,
    DropdownButton,
    ModifierSizeCard,
    AddIngredientModal,
    AddAddonModal
],
  templateUrl: './add-drink-page.html',
  styleUrl: './add-drink-page.css'
})
export class AddDrinkPage implements OnInit {
  isDropdownOpen = false;
  isSizeSelected = false;
  drink: string;

  availableSizes: ModifierSize[] = [];
  selectedSizeId: number | null = 1;

  isRecipeBuilderVisible = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.drink = nav?.extras.state?.['drink'];
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('name');
    this.fetchSizesFromDatabase();
  }

  fetchSizesFromDatabase() {
    this.availableSizes = [
      { id: 1, name: 'Tall', ozAmount: 12 },
      { id: 2, name: 'Grande', ozAmount: 16 },
      { id: 3, name: 'Venti', ozAmount: 20 }
    ];
  }

  onSizeSelect(sizeId: number) {
    if (this.selectedSizeId === sizeId) {
      this.selectedSizeId = null;
    } else {
      this.selectedSizeId = sizeId;
    }
  }

  openIngredientModal() {
    this.modalService.openIngredientModal();
  }

  openAddOnModal() {
    this.modalService.openAddOnModal();
  }
}
