import { Component, Input } from '@angular/core';
import { DropdownButton } from "../../../../shared/components/dropdown-button/dropdown-button";
import { YellowButton } from "../../../../shared/components/yellow-button/yellow-button";
import { RedButton } from "../../../../shared/components/red-button/red-button";

@Component({
  selector: 'app-add-addon-modal',
  imports: [DropdownButton, YellowButton, RedButton],
  templateUrl: './add-addon-modal.html',
  styleUrl: './add-addon-modal.css',
})
export class AddAddonModal {
@Input() addons !: string;
@Input() isEditing = false;
}
