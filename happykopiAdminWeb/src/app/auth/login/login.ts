import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  passwordVisible = signal(false);

  passwordFieldType = computed(() => this.passwordVisible() ? 'text' : 'password');

  togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.user.role.toLowerCase() === 'admin') {
          this.router.navigate(['/admin/dashboard']); // Or whatever your admin home is
        } else {
          this.errorMessage = 'Access denied. Only admins can log in here.';
          this.authService.logout(); // Log out the non-admin user
        }
      },
      error: (err) => (this.errorMessage = err.error || 'Invalid username or password.'),
    });
  }
}
