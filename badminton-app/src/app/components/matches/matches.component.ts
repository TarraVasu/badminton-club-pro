import { Component, OnInit } from '@angular/core';
import { DataService, Match } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {
  matches: Match[] = [];
  filteredMatches: Match[] = [];
  liveMatch: Match | undefined;
  playerNames: string[] = [];

  showScheduleModal = false;
  showScoreModal = false;
  matchFormError = '';
  scoreMatch: any = null;

  newMatch: any = this.defaultMatch();

  private _activeTab = 'all';
  get activeTab() { return this._activeTab; }
  set activeTab(val: string) { this._activeTab = val; this.filterMatches(); }

  constructor(private data: DataService, public auth: AuthService, private router: Router) { }

  get userRole() { return this.auth.user.role; }

  ngOnInit() {
    this.data.getMatches().subscribe(matches => {
      this.matches = matches;
      this.liveMatch = this.matches.find(m => m.status === 'Live');
      this.filterMatches();
    });
    this.data.getPlayers().subscribe(players => {
      this.playerNames = players.map(p => p.name);
    });
  }

  defaultMatch() {
    return {
      player1: '', player2: '', date: new Date().toISOString().split('T')[0],
      time: '06:00', court: '', type: 'Singles', notes: ''
    };
  }

  filterMatches() {
    if (this._activeTab === 'all') this.filteredMatches = [...this.matches];
    else this.filteredMatches = this.matches.filter(m => m.status.toLowerCase() === this._activeTab);
  }

  openScheduleModal() { this.showScheduleModal = true; this.matchFormError = ''; this.newMatch = this.defaultMatch(); }
  closeScheduleModal() { this.showScheduleModal = false; }

  scheduleMatch() {
    this.matchFormError = '';
    if (!this.newMatch.player1) { this.matchFormError = 'Please select Player 1.'; return; }
    if (!this.newMatch.player2) { this.matchFormError = 'Please select Player 2.'; return; }
    if (this.newMatch.player1 === this.newMatch.player2) { this.matchFormError = 'Players cannot be the same.'; return; }
    if (!this.newMatch.date) { this.matchFormError = 'Match date is required.'; return; }
    if (!this.newMatch.court) { this.matchFormError = 'Please select a court.'; return; }

    const m: Omit<Match, 'id'> = {
      player1: this.newMatch.player1,
      player2: this.newMatch.player2,
      score1: 0, score2: 0,
      date: this.newMatch.date,
      court: this.newMatch.court,
      type: this.newMatch.type,
      status: 'Scheduled',
      winner: '-',
      duration: '-'
    };
    this.data.addMatch(m).subscribe(newM => {
      this.matches.push(newM);
      this.filterMatches();
    });
    this.closeScheduleModal();
  }

  openScoreModal(m: Match) { this.scoreMatch = { ...m }; this.showScoreModal = true; }
  closeScoreModal() { this.showScoreModal = false; this.scoreMatch = null; }

  saveScore() {
    const idx = this.matches.findIndex(m => m.id === this.scoreMatch.id);
    if (idx !== -1) {
      const m = this.matches[idx];
      m.score1 = this.scoreMatch.score1;
      m.score2 = this.scoreMatch.score2;
      m.duration = this.scoreMatch.duration;
      m.status = this.scoreMatch.status;
      if (m.status === 'Completed') {
        m.winner = m.score1 > m.score2 ? m.player1 : m.player2;
      }
    }
    this.filterMatches();
    this.closeScoreModal();
  }

  deleteMatch(id?: number) {
    if (id && confirm('Delete this match?')) {
      this.data.deleteMatch(id).subscribe(() => {
        this.matches = this.matches.filter(m => m.id !== id);
        this.filterMatches();
      });
    }
  }

  getStatusClass(status: string) {
    return {
      'badge-success': status === 'Completed',
      'badge-danger': status === 'Live',
      'badge-info': status === 'Scheduled',
    };
  }

  viewStats() {
    this.router.navigate(['/']);
  }
}
