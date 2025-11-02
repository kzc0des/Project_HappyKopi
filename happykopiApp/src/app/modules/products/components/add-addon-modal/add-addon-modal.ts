import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropdownButton } from "../../../../shared/components/dropdown-button/dropdown-button";
import { YellowButton } from "../../../../shared/components/yellow-button/yellow-button";
import { RedButton } from "../../../../shared/components/red-button/red-button";
import { Observable } from 'rxjs';
import { ModalService } from '../../services/modal-service/modal.service';
import { AsyncPipe } from '@angular/common';
import { DropdownOption } from '../../../../shared/components/dropdown-button/dropdown-option';
import { AddOnItem } from '../../../../core/dtos/product/product.model';
import { QuantityButton } from "../../../../shared/components/quantity-button/quantity-button";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-add-addon-modal',
  imports: [DropdownButton, YellowButton, RedButton, AsyncPipe, QuantityButton, FormsModule],
  templateUrl: './add-addon-modal.html',
  styleUrl: './add-addon-modal.css',
})
export class AddAddonModal {
  @Input() addons !: string;
  @Input() isEditing = false;

  @Input() addOnOption: DropdownOption[] = [];
  @Output() saveAddOn = new EventEmitter<AddOnItem>(); //payload

  public selectedAddOnId: number | null = null;
  public times: number = 1;

  isAddOnOpen$: Observable<boolean>;

  constructor(
    private modalService: ModalService
  ) {
    this.isAddOnOpen$ = modalService.isAddOnModalOpen$;
  }

  close() {
    this.modalService.closeAddOnModal();
    this.selectedAddOnId = null;
    this.times = 1;
  }

  onSave() {
    if (this.selectedAddOnId && this.times >= 0) {
      const payload: AddOnItem = {
        addOnId: this.selectedAddOnId,
        times: this.times
      };
      console.log(`Payload from the addon modal: ${payload.addOnId} ${payload.times}`)
      this.saveAddOn.emit(payload);
      this.resetModalState();

    } else {
      console.error("Fill out all the fields.");
    }
  }

  private resetModalState() {
    this.selectedAddOnId = null;
    this.times = 1;
  }
}
