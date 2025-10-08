import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  passwordVisible = signal(false);

  passwordFieldType = computed(() => this.passwordVisible() ? 'text' : 'password');

  togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }
}
