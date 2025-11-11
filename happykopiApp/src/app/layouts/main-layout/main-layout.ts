import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../../shared/components/header/header";
import { Sidebar } from "../../shared/components/sidebar/sidebar";
import { ConfirmationDialog } from "../../shared/components/confirmation-dialog/confirmation-dialog";
import { AlertDialog } from "../../shared/components/alert-dialog/alert-dialog";
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar, ConfirmationDialog, AlertDialog, LoadingSpinner],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
