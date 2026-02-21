import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: any[] = [];

  colors = ['var(--gradient-primary)', 'linear-gradient(135deg,#6c63ff,#ff6b35)', 'linear-gradient(135deg,#3b82f6,#00d4aa)', 'linear-gradient(135deg,#f59e0b,#ef4444)', 'linear-gradient(135deg,#22c55e,#6c63ff)', 'linear-gradient(135deg,#ff6b35,#f59e0b)', 'linear-gradient(135deg,#6c63ff,#3b82f6)', 'linear-gradient(135deg,#00d4aa,#22c55e)'];

  constructor(private data: DataService) { }
  ngOnInit() {
    this.data.getPlayers().subscribe(players => {
      this.leaderboard = players
        .sort((a, b) => b.points - a.points)
        .map((p, i) => ({ ...p, rank: i + 1, winRate: Math.round((p.wins / (p.wins + p.losses)) * 100) || 0 }));
    });
  }

  getColor(i: number) { return this.colors[i % this.colors.length]; }
  getRankClass(rank: number) { return { gold: rank === 1, silver: rank === 2, bronze: rank === 3 }; }
  getRankEmoji(rank: number) { return rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'; }
  getLevelClass(level: string) {
    return { 'level-a': level === 'Advanced', 'level-i': level === 'Intermediate', 'level-b': level === 'Beginner' };
  }
  getRandom(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
}
