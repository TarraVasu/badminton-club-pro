import { Component, OnInit } from '@angular/core';
import { DataService, Match } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleMatchDialogComponent } from './schedule-match-dialog/schedule-match-dialog.component';
import { ScoreMatchDialogComponent } from './score-match-dialog/score-match-dialog.component';

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
  isLoading = false;

  private _activeTab = 'all';
  get activeTab() { return this._activeTab; }
  set activeTab(val: string) { this._activeTab = val; this.filterMatches(); }

  constructor(
    private data: DataService,
    public auth: AuthService,
    private router: Router,
    private confirmDialog: ConfirmDialogService,
    private dialog: MatDialog
  ) { }

  get userRole() { return this.auth.user.role; }

  ngOnInit() {
    this.isLoading = true;
    this.data.getMatches().subscribe(matches => {
      this.matches = matches;
      this.liveMatch = this.matches.find(m => m.status === 'Live');
      this.filterMatches();
      this.isLoading = false;
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

  openScheduleModal() {
    const dialogRef = this.dialog.open(ScheduleMatchDialogComponent, {
      width: '580px',
      panelClass: 'custom-dialog-container',
      data: { match: this.defaultMatch(), playerNames: this.playerNames }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const m: Omit<Match, 'id'> = {
          player1: result.player1, player2: result.player2,
          score1: 0, score2: 0, date: result.date, court: result.court,
          type: result.type, status: 'Scheduled', winner: '-', duration: '-'
        };
        this.data.addMatch(m).subscribe(matches => {
          this.matches = matches;
          this.filterMatches();
        });
      }
    });
  }

  openScoreModal(m: Match) {
    const dialogRef = this.dialog.open(ScoreMatchDialogComponent, {
      width: '420px',
      panelClass: 'custom-dialog-container',
      data: { match: m }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const idx = this.matches.findIndex(x => x.id === result.id);
        if (idx !== -1) {
          const match = this.matches[idx];
          match.score1 = result.score1;
          match.score2 = result.score2;
          match.duration = result.duration;
          match.status = result.status;
          if (match.status === 'Completed') {
            match.winner = match.score1 > match.score2 ? match.player1 : match.player2;
          }
        }
        this.filterMatches();
      }
    });
  }

  async deleteMatch(id?: number) {
    if (!id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Match',
      message: 'Are you sure you want to delete this match record? This cannot be undone.',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    if (confirmed) {
      this.data.deleteMatch(id).subscribe(matches => {
        this.matches = matches;
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

