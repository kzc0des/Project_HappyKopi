import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropdownButton } from "../../../../shared/components/dropdown-button/dropdown-button";
import { YellowButton } from "../../../../shared/components/yellow-button/yellow-button";
import { RedButton } from "../../../../shared/components/red-button/red-button";
import { Observable } from 'rxjs';
import { ModalService } from '../../services/modal-service/modal.service';
import { AsyncPipe } from '@angular/common';
import { DropdownOption } from '../../../../shared/components/dropdown-button/dropdown-option';
import { QuantityButton } from "../../../../shared/components/quantity-button/quantity-button";
import { FormsModule } from "@angular/forms";
import { AddOnItem } from '../../../../core/dtos/product/product.model';

@Component({
  selector: 'app-add-addon-modal',
  imports: [DropdownButton, YellowButton, RedButton, AsyncPipe, QuantityButton, FormsModule],
  templateUrl: './add-addon-modal.html',
  styleUrl: './add-addon-modal.css',
})
export class AddAddonModal {
  @Input() isEditing = false;
  @Input() addOnOption: DropdownOption[] = [];
  @Input() addon: AddOnItem | null = null;

  public hasChanges: boolean = false;
  private _initialAddonState: { addOnId: number | null; times: number } | null = null;
  @Output() deleteAddOn = new EventEmitter<void>();
  @Output() saveAddOn = new EventEmitter<AddOnItem>();

  public selectedAddOnId: number | null = null;
  public times: number = 1;

  isAddOnOpen$: Observable<boolean>;

  constructor(
    private modalService: ModalService
  ) {
    this.isAddOnOpen$ = modalService.isAddOnModalOpen$;
  }

  ngOnChanges() {
    // Reset form fields and initial state when editing or adding a new item
    this.selectedAddOnId = null;
    this.times = 1;
    this._initialAddonState = null;
    this.hasChanges = false;

    if (this.isEditing && this.addon) { // If editing, populate with add-on data
      this.selectedAddOnId = this.addon.addOnId;
      this.times = this.addon.times;
      this._initialAddonState = {
        addOnId: this.addon.addOnId,
        times: this.addon.times
      };
    }
    this.updateHasChanges(); // Check for changes after initial setup
  }

  onAddonChange(value: number | null) {
    this.selectedAddOnId = value;
    this.updateHasChanges();
  }

  onTimesChange(value: number) {
    this.times = value;
    this.updateHasChanges();
  }

  close() {
    this.modalService.closeAddOnModal();
    this.selectedAddOnId = null;
    this.times = 1;
    this.hasChanges = false;
    this._initialAddonState = null;

  }

  onSave() {
    if (this.selectedAddOnId && this.times > 0) {
      
      const selectedOption = this.addOnOption.find(
        opt => opt.value === this.selectedAddOnId
      );

      if (!selectedOption) {
        console.error('Could not find selected add-on option.');
        return;
      }

      const labelMatch = selectedOption.label.match(/(.*) \(\+₱.*\)/);
      let modifierName = selectedOption.label;
      
      if (labelMatch && labelMatch[1]) {
        modifierName = labelMatch[1].trim();
      }

      const payload: AddOnItem = {
        addOnId: this.selectedAddOnId,
        times: this.times,
        modifierName: modifierName,
        price: selectedOption.price || 0
      };

      this.saveAddOn.emit(payload);
      this.close(); // Close and reset after save
    }    
  }

  private updateHasChanges(): void {
    if (this.isEditing && this._initialAddonState) {
      this.hasChanges =
        this.selectedAddOnId !== this._initialAddonState.addOnId ||
        this.times !== this._initialAddonState.times;
    } else {
      // For new add-ons, changes exist if any field is filled beyond default
      this.hasChanges = this.selectedAddOnId !== null;
    }
  }

  onDelete(): void {
    this.deleteAddOn.emit();
    this.close();
  }
}