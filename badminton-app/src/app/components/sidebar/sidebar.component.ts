import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

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
    { icon: '📊', label: 'Dashboard', route: 'dashboard', badge: null, adminOnly: false },
    { icon: '👥', label: 'Players', route: 'players', badge: '0', adminOnly: false },
    { icon: '🏸', label: 'Matches', route: 'matches', badge: '0', adminOnly: false },
    { icon: '📅', label: 'Sessions', route: 'sessions', badge: '0', adminOnly: false },
    { icon: '💳', label: 'Payments', route: 'payments', badge: '0', adminOnly: true },
    { icon: '🏆', label: 'Leaderboard', route: 'leaderboard', badge: null, adminOnly: false },
  ];

  constructor(private router: Router, private dataService: DataService, private authService: AuthService) {
    // Filter nav items by role
    if (this.authService.user.role === 'Player') {
      this.navItems = this.navItems.filter(item => !item.adminOnly);
    }

    this.router.events.subscribe(() => {
      const url = this.router.url.replace('/', '');
      this.activeRoute = url || 'dashboard';
    });

    // Sync badges with data service
    this.dataService.playersCount$.subscribe(count => this.updateBadge('players', count));
    this.dataService.matchesCount$.subscribe(count => this.updateBadge('matches', count));
    this.dataService.sessionsCount$.subscribe(count => this.updateBadge('sessions', count));
    this.dataService.paymentsCount$.subscribe(count => this.updateBadge('payments', count));
  }

  updateBadge(route: string, count: number) {
    const item = this.navItems.find(i => i.route === route);
    if (item) {
      item.badge = count > 0 ? count.toString() : null;
    }
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
