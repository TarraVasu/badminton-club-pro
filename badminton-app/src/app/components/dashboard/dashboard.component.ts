import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  recentMatches: any[] = [];
  topPlayers: any[] = [];
  todaySessions: any[] = [];

  weekActivity = [
    { day: 'Mon', count: 4, pct: 60 },
    { day: 'Tue', count: 6, pct: 90 },
    { day: 'Wed', count: 3, pct: 45 },
    { day: 'Thu', count: 5, pct: 75 },
    { day: 'Fri', count: 7, pct: 100 },
    { day: 'Sat', count: 8, pct: 100 },
    { day: 'Sun', count: 2, pct: 30 },
  ];

  paymentStats = [
    { label: 'Paid', count: 5, amount: 13500, color: '#22c55e' },
    { label: 'Pending', count: 1, amount: 2500, color: '#f59e0b' },
    { label: 'Overdue', count: 2, amount: 5000, color: '#ef4444' },
  ];

  avatarColors = ['var(--gradient-primary)', 'linear-gradient(135deg,#6c63ff,#ff6b35)', 'linear-gradient(135deg,#3b82f6,#00d4aa)', 'linear-gradient(135deg,#f59e0b,#ef4444)'];

  constructor(private data: DataService, private router: Router) { }

  ngOnInit() {
    this.data.getPlayers().subscribe(players => {
      this.topPlayers = players
        .sort((a, b) => b.points - a.points)
        .slice(0, 4)
        .map((p, i) => ({ ...p, rank: i + 1, winRate: Math.round((p.wins / (p.wins + p.losses)) * 100) || 0 }));

      this.stats.totalPlayers = players.length;
      this.stats.activePlayers = players.filter(p => p.status === 'Active').length;
    });

    this.data.getMatches().subscribe(matches => {
      this.recentMatches = matches.slice(0, 5);
      this.stats.totalMatches = matches.length;
      this.stats.liveMatches = matches.filter(m => m.status === 'Live').length;
    });

    this.data.getSessions().subscribe(sessions => {
      this.todaySessions = sessions.filter(s => s.status !== 'Completed').slice(0, 3);
      this.stats.upcomingSessions = sessions.filter(s => s.status === 'Upcoming').length;
    });

    this.data.getPayments().subscribe(payments => {
      this.stats.totalRevenue = payments.filter(p => p.status === 'Paid').reduce((a, b) => a + b.amount, 0);
      this.stats.pendingPayments = payments.filter(p => p.status !== 'Paid').length;
    });
  }

  goTo(route: string) { this.router.navigate([`/${route}`]); }

  getMatchStatusClass(status: string) {
    return {
      'badge-success': status === 'Completed',
      'badge-danger': status === 'Live',
      'badge-info': status === 'Scheduled',
    };
  }
  getSessionStatusClass(status: string) {
    return {
      'badge-success': status === 'Ongoing',
      'badge-info': status === 'Upcoming',
      'badge-warning': status === 'Full',
      'badge-primary': status === 'Completed',
    };
  }
  getRankClass(rank: number) {
    return { 'gold': rank === 1, 'silver': rank === 2, 'bronze': rank === 3 };
  }
  getRankEmoji(rank: number) {
    return rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
  }
  getAvatarColor(i: number) { return this.avatarColors[i % this.avatarColors.length]; }
}
