import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserForLoginDto } from '../../../core/dtos/auth/user-for-login-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  constructor(private readonly _authService: AuthService, private router:Router) {}

  public user:UserForLoginDto = {
    username: '',
    password: ''
  }

  passwordVisible = signal(false);

  passwordFieldType = computed(() => this.passwordVisible() ? 'text' : 'password');

  togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  onSubmit(form: any): void {
    if (form.valid) {
      this._authService.login(this.user).subscribe({
        next: (response) => {
          alert(`Welcome, ${response.user.username}`);
          this.router.navigate(['/app']);
          // The AuthService will now handle the redirection.
        },
        error: (err) => {alert('Wrong Credentials')}
      });
    }
  }
}
