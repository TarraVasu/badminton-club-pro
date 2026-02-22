import { Component } from '@angular/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  isLampOn = false;

  errors: { email?: string; password?: string; general?: string } = {};

  constructor(
    private auth: AuthService,
    public loader: LoaderService,
    private toast: ToastService
  ) { }

  toggleLamp() {
    this.isLampOn = !this.isLampOn;
  }

  validate() {
    this.errors = {};
    let isValid = true;

    if (!this.email) {
      this.errors.email = 'Email is required';
      isValid = false;
    } else if (!this.validateEmail(this.email)) {
      this.errors.email = 'Invalid email format';
      isValid = false;
    }

    if (!this.password) {
      this.errors.password = 'Password is required';
      isValid = false;
    }

    return isValid;
  }

  validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  onLogin() {
    if (!this.validate()) return;

    this.loader.show();
    this.auth.login(this.email, this.password)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (res) => {
          this.auth.handleLoginSuccess(res, this.email);
        },
        error: (err) => {
          console.error('Login error:', err);
          const errorMsg = err.error?.error;

          if (err.status === 404 || errorMsg === 'user_not_found') {
            this.errors.general = 'Account not found';
            this.errors.email = ' '; // Highlight red
            // Using a snackbar/toast for "User not found" as requested
            this.toast.error('User not found. Please check your email or register.');
          } else if (err.status === 401 || errorMsg === 'invalid_password') {
            this.errors.general = 'Invalid password';
            this.errors.password = ' '; // Highlight red
          } else {
            this.errors.general = 'Login failed. Please try again.';
          }
        }
      });
  }
}
