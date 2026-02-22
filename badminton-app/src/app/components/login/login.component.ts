import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;

  constructor(private auth: AuthService, public loader: LoaderService) { }

  onLogin() {
    this.auth.login(this.email, this.password);
  }
}
