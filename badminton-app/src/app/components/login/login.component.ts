import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = 'admin@mail.com';
  password = 'password';
  showPassword = false;
  isLoading = false;

  constructor(private auth: AuthService) { }

  onLogin() {
    this.isLoading = true;
    setTimeout(() => {
      this.auth.login(this.email, this.password);
      this.isLoading = false;
    }, 1000);
  }
}
