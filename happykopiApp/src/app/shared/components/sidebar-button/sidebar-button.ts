import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sidebar-button',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './sidebar-button.html',
  styleUrl: './sidebar-button.css'
})
export class SidebarButton {
  @Input() page!: string;
  @Input() route!: string;
  @Input() isSelected: boolean = false;
  @Output() action = new EventEmitter<void>();

  handleClick() {
  this.action.emit();
  }
}
