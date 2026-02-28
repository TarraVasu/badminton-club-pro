import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: any = {
    totalPlayers: 0,
    totalMatches: 0,
    liveMatches: 0,
    upcomingSessions: 0,
    totalRevenue: 0,
    pendingPayments: 0
  };
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

  // Chart Configuration
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: this.weekActivity.map(d => d.day),
    datasets: [
      {
        data: this.weekActivity.map(d => d.count),
        label: 'Matches',
        fill: true,
        tension: 0.4,
        borderColor: '#00d4aa',
        backgroundColor: 'rgba(0, 212, 170, 0.1)',
        pointBackgroundColor: '#00d4aa',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00d4aa',
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#f0f4ff',
        bodyColor: '#8892a4',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => ` ${context.parsed.y} Matches`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#8892a4', font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#8892a4', font: { size: 10 } }
      }
    }
  };

  public lineChartType: ChartType = 'line';

  liveMatches: any[] = [];

  avatarColors = ['var(--gradient-primary)', 'linear-gradient(135deg,#6c63ff,#ff6b35)', 'linear-gradient(135deg,#3b82f6,#00d4aa)', 'linear-gradient(135deg,#f59e0b,#ef4444)'];

  constructor(private data: DataService, private router: Router, public auth: AuthService, private toast: ToastService) { }

  get userRole() { return this.auth.user.role; }

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
      this.liveMatches = matches.filter(m => m.status === 'Live');
      this.stats.totalMatches = matches.length;
      this.stats.liveMatches = this.liveMatches.length;
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

  exportReport() {
    this.toast.info('Generating PDF Performance Report...');

    setTimeout(() => {
      try {
        const doc = new jsPDF();

        // Brand Header
        doc.setFontSize(22);
        doc.setTextColor(0, 212, 170);
        doc.text('🐾 Birdie Beasts', 14, 22);

        doc.setFontSize(16);
        doc.setTextColor(100);
        doc.text('Club Analytics Dashboard', 14, 32);

        doc.setFontSize(10);
        doc.text(`Run Time: ${new Date().toLocaleString()}`, 14, 40);

        // Section 1: Key Stats
        doc.setFontSize(14);
        doc.setTextColor(50);
        doc.text('1. Club Activity & Engagement', 14, 52);

        autoTable(doc, {
          startY: 56,
          head: [['Metric', 'Value', 'Status']],
          body: [
            ['Total Registered Players', this.stats.totalPlayers, '✅ Active'],
            ['Total Matches Tracked', this.stats.totalMatches, '📈 Growing'],
            ['Current Live Matches', this.stats.liveMatches, '🔴 Priority'],
            ['Upcoming Group Sessions', this.stats.upcomingSessions, '📅 Scheduled']
          ],
          margin: { left: 14 },
          headStyles: { fillColor: [0, 212, 170] }
        });

        // Section 2: Financial Overview
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text('2. Financial Health Summary', 14, finalY);

        autoTable(doc, {
          startY: finalY + 4,
          head: [['Description', 'Volume', 'Estimated Revenue']],
          body: [
            ['Total Revenue (Paid)', `${this.paymentStats[0].count} invoices`, `INR ${this.stats.totalRevenue}`],
            ['Pending Collections', `${this.stats.pendingPayments} accounts`, `INR ${this.paymentStats[1].amount + (this.paymentStats[2]?.amount || 0)}`],
            ['Revenue Standing', '-', 'Stable']
          ],
          margin: { left: 14 },
          headStyles: { fillColor: [108, 99, 255] }
        });

        doc.save(`Birdie_Beasts_Dashboard_${new Date().toISOString().split('T')[0]}.pdf`);
        this.toast.success('Dashboard Report Exported!');
      } catch (err) {
        console.error('PDF Export Error:', err);
        this.toast.error('Failed to export PDF.');
      }
    }, 1500);
  }

  sendReminders() {
    this.toast.info('Sending payment reminders to players...');
    setTimeout(() => {
      this.toast.success('Reminders sent to all pending accounts.');
    }, 1500);
  }

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
