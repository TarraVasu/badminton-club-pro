import { Component, HostListener } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Badminton Club Pro';
  sidebarCollapsed = false;
  mobileOpen = false;
  isMobile = false;

  constructor(public themeService: ThemeService, public auth: AuthService) {
    this.checkMobile();
  }

  @HostListener('window:resize')
  checkMobile() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.sidebarCollapsed = false;
    }
  }

  toggleMobileMenu() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobileMenu() {
    this.mobileOpen = false;
  }
}
