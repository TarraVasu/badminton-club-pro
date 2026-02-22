import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
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
  userDropdownOpen = false;

  constructor(public themeService: ThemeService, public auth: AuthService, private router: Router) {
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

  toggleUserDropdown(event: Event) {
    event.stopPropagation();
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.userDropdownOpen = false;
  }

  goToProfile() {
    this.userDropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  handleLogout() {
    this.userDropdownOpen = false;
    this.auth.logout();
  }
}
