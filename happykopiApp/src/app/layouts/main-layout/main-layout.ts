import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../../shared/components/header/header";
import { Sidebar } from "../../shared/components/sidebar/sidebar";
import { ConfirmationDialog } from "../../shared/components/confirmation-dialog/confirmation-dialog";
import { AlertDialog } from '../../shared/components/alert-dialog/alert-dialog';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar, ConfirmationDialog, AlertDialog],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
