import { Component, OnInit } from '@angular/core';
import { DataService, Session } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  sessions: Session[] = [];
  showModal = false;
  editMode = false;
  formError = '';
  editingId?: number | null = null;

  newSession: any = this.defaultSession();

  constructor(private data: DataService, public auth: AuthService, private confirmDialog: ConfirmDialogService) { }

  get userRole() { return this.auth.user.role; }
  ngOnInit() {
    this.data.getSessions().subscribe(sessions => {
      this.sessions = sessions;
    });
  }

  defaultSession() {
    return {
      title: '', type: '', status: 'Upcoming',
      date: new Date().toISOString().split('T')[0],
      time: '06:00 AM', court: '', coach: '',
      players: 0, maxPlayers: 10, fee: 500
    };
  }

  openModal() { this.showModal = true; this.editMode = false; this.newSession = this.defaultSession(); this.formError = ''; }

  openEditModal(s: Session) {
    this.editMode = true;
    this.showModal = true;
    this.editingId = s.id;
    this.newSession = { ...s };
    this.formError = '';
  }

  closeModal() { this.showModal = false; this.editingId = null; }

  saveSession() {
    this.formError = '';
    if (!this.newSession.title?.trim()) { this.formError = 'Session title is required.'; return; }
    if (!this.newSession.type) { this.formError = 'Please select a session type.'; return; }
    if (!this.newSession.date) { this.formError = 'Date is required.'; return; }
    if (!this.newSession.court) { this.formError = 'Please select a court.'; return; }

    if (this.editMode && this.editingId) {
      this.data.updateSession(this.editingId, { ...this.newSession, id: this.editingId }).subscribe(sessions => {
        this.sessions = sessions;
      });
    } else {
      this.data.addSession(this.newSession).subscribe(sessions => {
        this.sessions = sessions;
      });
    }
    this.closeModal();
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
      this.data.deleteSession(id).subscribe(sessions => {
        this.sessions = sessions;
      });
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
