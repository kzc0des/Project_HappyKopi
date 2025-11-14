import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AlertService } from '../../../core/services/alert/alert.service';
import { TextBoxComponent } from '../../../shared/components/text-box/text-box';
import { YellowButton } from '../../../shared/components/yellow-button/yellow-button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-barista',
  imports: [ReactiveFormsModule, TextBoxComponent, YellowButton, CommonModule],
  templateUrl: './register-barista.html',
  styleUrl: './register-barista.css',
})
export class RegisterBarista {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.registerBarista(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.alertService.show('Success', 'Barista registered successfully!', 'success').then(() => {
          this.registerForm.reset();
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.alertService.show('Registration Failed', err.error?.message || 'An unknown error occurred.', 'danger');
      }
    });
  }
}
