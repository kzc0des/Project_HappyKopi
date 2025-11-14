import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserForLoginDto } from '../../../core/dtos/auth/user-for-login-dto';
import { Router } from '@angular/router';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { finalize } from 'rxjs';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LoadingSpinner],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  constructor(
    private readonly _authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) { }

  public user:UserForLoginDto = {
    username: '',
    password: ''
  }

  passwordVisible = signal(false);
  errorMessage: string | null = null;

  passwordFieldType = computed(() => this.passwordVisible() ? 'text' : 'password');

  togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  onSubmit(form: any): void {
    if (form.valid) {
      this.errorMessage = null;
      this.loadingService.show();
      this._authService.login(this.user)
        .pipe(
          finalize(() => this.loadingService.hide())
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/app']);
          },
          error: (err) => {
            this.errorMessage = err.error?.message || 'Invalid username or password.';
          }
        });
    }
  }
}
