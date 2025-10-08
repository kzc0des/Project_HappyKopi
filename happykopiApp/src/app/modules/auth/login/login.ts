import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  passwordVisible = signal(false);

  passwordFieldType = computed(() => this.passwordVisible() ? 'text' : 'password');

  togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Form Submitted!', form.value);
    }
  }
}
