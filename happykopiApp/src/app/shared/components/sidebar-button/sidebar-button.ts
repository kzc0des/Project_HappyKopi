import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sidebar-button',
  imports: [RouterLink],
  templateUrl: './sidebar-button.html',
  styleUrl: './sidebar-button.css'
})
export class SidebarButton {
@Input() value!: string;
@Input() destination!: string;
}
