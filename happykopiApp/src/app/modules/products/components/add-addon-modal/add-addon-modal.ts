import { Component, Input, OnInit } from '@angular/core';
import { DropdownButton } from "../../../../shared/components/dropdown-button/dropdown-button";
import { YellowButton } from "../../../../shared/components/yellow-button/yellow-button";
import { RedButton } from "../../../../shared/components/red-button/red-button";
import { Observable } from 'rxjs';
import { ModalService } from '../../services/modal-service/modal.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-add-addon-modal',
  imports: [DropdownButton, YellowButton, RedButton, AsyncPipe],
  templateUrl: './add-addon-modal.html',
  styleUrl: './add-addon-modal.css',
})
export class AddAddonModal{
  @Input() addons !: string;
  @Input() isEditing = false;

  isAddOnOpen$: Observable<boolean>;

  constructor(
    private modalService: ModalService
  ) {
    this.isAddOnOpen$ = modalService.isAddOnModalOpen$;
  }

  close() {
    this.modalService.closeAddOnModal();
  }
}
