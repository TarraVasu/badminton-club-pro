import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnChanges {
  collapsed = false;
  activeRoute = 'dashboard';

  @Input() mobileOpen = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() closeMenu = new EventEmitter<void>();

  navItems = [
    { icon: '📊', label: 'Dashboard', route: 'dashboard', badge: null },
    { icon: '👥', label: 'Players', route: 'players', badge: '8' },
    { icon: '🏸', label: 'Matches', route: 'matches', badge: '2' },
    { icon: '📅', label: 'Sessions', route: 'sessions', badge: null },
    { icon: '💳', label: 'Payments', route: 'payments', badge: '3' },
    { icon: '🏆', label: 'Leaderboard', route: 'leaderboard', badge: null },
  ];

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url.replace('/', '');
      this.activeRoute = url || 'dashboard';
    });
  }

  ngOnChanges() { }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  navigate(route: string) {
    this.activeRoute = route;
    this.router.navigate([`/${route}`]);
    this.closeMenu.emit(); // close mobile drawer after navigation
  }
}
