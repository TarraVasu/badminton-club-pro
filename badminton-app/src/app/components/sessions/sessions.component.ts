import { Component, OnInit } from '@angular/core';
import { DataService, Session } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { SessionDialogComponent } from './session-dialog/session-dialog.component';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  sessions: Session[] = [];
  isLoading = false;

  constructor(
    private data: DataService,
    public auth: AuthService,
    private confirmDialog: ConfirmDialogService,
    private dialog: MatDialog
  ) { }

  get userRole() { return this.auth.user.role; }

  ngOnInit() {
    this.isLoading = true;
    this.data.getSessions().subscribe(sessions => {
      this.sessions = sessions;
      this.isLoading = false;
    });
  }

  defaultSession() {
    return {
      title: '', type: '', status: 'Upcoming',
      date: new Date().toISOString().split('T')[0],
      time: '06:00', court: '', coach: '',
      players: 0, maxPlayers: 10, fee: 500
    };
  }

  openModal() {
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      width: '620px',
      panelClass: 'custom-dialog-container',
      data: { session: this.defaultSession(), editMode: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.addSession(result).subscribe(sessions => { this.sessions = sessions; });
      }
    });
  }

  openEditModal(s: Session) {
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      width: '620px',
      panelClass: 'custom-dialog-container',
      data: { session: { ...s }, editMode: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && s.id) {
        this.data.updateSession(s.id, { ...result, id: s.id }).subscribe(sessions => { this.sessions = sessions; });
      }
    });
  }

  async deleteSession(id?: number) {
    if (!id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Session',
      message: 'Are you sure you want to delete this session? This cannot be undone.',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    if (confirmed) {
      this.data.deleteSession(id).subscribe(sessions => { this.sessions = sessions; });
    }
  }

  getTypeIcon(type: string) {
    return type === 'Training' ? '🎯' : type === 'Practice' ? '🏸' : type === 'Tournament' ? '🏆' : '🤝';
  }

  getStatusClass(status: string) {
    return {
      'badge-success': status === 'Ongoing',
      'badge-info': status === 'Upcoming',
      'badge-warning': status === 'Full',
      'badge-primary': status === 'Completed',
      'badge-danger': status === 'Cancelled',
    };
  }
}
