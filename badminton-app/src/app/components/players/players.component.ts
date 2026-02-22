import { Component, OnInit } from '@angular/core';
import { DataService, Player } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
  players: Player[] = [];
  filteredPlayers: Player[] = [];
  searchQuery = '';
  levelFilter = '';
  showModal = false;
  editMode = false;
  formError = '';
  selectedColorIdx = 0;

  colorOptions = [
    'linear-gradient(135deg,#00d4aa,#6c63ff)',
    'linear-gradient(135deg,#6c63ff,#ff6b35)',
    'linear-gradient(135deg,#3b82f6,#00d4aa)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#22c55e,#6c63ff)',
    'linear-gradient(135deg,#ff6b35,#f59e0b)',
    'linear-gradient(135deg,#6c63ff,#3b82f6)',
    'linear-gradient(135deg,#00d4aa,#22c55e)',
  ];

  get previewColor() { return this.colorOptions[this.selectedColorIdx]; }

  defaultPlayer = () => ({
    name: '', email: '', phone: '', level: '', wins: 0, losses: 0,
    points: 0, status: 'Active', avatar: '', joinDate: new Date().toISOString().split('T')[0], matchesPlayed: 0
  });

  newPlayer: any = this.defaultPlayer();
  editingId?: number | null = null;
  selectedFile: File | null = null;

  constructor(private data: DataService, public auth: AuthService) { }

  get userRole() { return this.auth.user.role; }

  ngOnInit() {
    this.data.getPlayers().subscribe(players => {
      this.players = players;
      this.filteredPlayers = [...this.players];
    });
  }

  selectColor(i: number) { this.selectedColorIdx = i; }
  updateAvatar() {
    const parts = this.newPlayer.name.trim().split(' ');
    this.newPlayer.avatar = parts.map((n: string) => n[0] || '').join('').substring(0, 2).toUpperCase();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  getColor(i: number) { return this.colorOptions[i % this.colorOptions.length]; }
  getWinRate(p: Player) { return p.wins + p.losses > 0 ? Math.round((p.wins / (p.wins + p.losses)) * 100) : 0; }
  getLevelClass(level: string) {
    return { 'level-advanced': level === 'Advanced', 'level-intermediate': level === 'Intermediate', 'level-beginner': level === 'Beginner' };
  }
  getLevelIcon(level: string) { return level === 'Advanced' ? '⚡' : level === 'Intermediate' ? '🌟' : '🌱'; }

  filterPlayers() {
    this.filteredPlayers = this.players.filter(p => {
      const s = this.searchQuery.toLowerCase();
      return (!s || p.name.toLowerCase().includes(s) || p.email.toLowerCase().includes(s) || p.phone.includes(s))
        && (!this.levelFilter || p.level === this.levelFilter);
    });
  }

  setFilter(level: string) { this.levelFilter = level; this.filterPlayers(); }

  openModal() { this.showModal = true; this.editMode = false; this.newPlayer = this.defaultPlayer(); this.formError = ''; this.selectedFile = null; }
  openEditModal(p: Player) {
    this.editMode = true;
    this.showModal = true;
    this.editingId = p.id;
    this.newPlayer = { ...p };
    this.formError = '';
    this.selectedFile = null;
  }
  closeModal() { this.showModal = false; this.editingId = null; this.selectedFile = null; }

  savePlayer() {
    this.formError = '';
    if (!this.newPlayer.name.trim()) { this.formError = 'Full name is required.'; return; }
    if (!this.newPlayer.email.trim()) { this.formError = 'Email address is required.'; return; }
    if (!this.newPlayer.level) { this.formError = 'Please select a skill level.'; return; }

    this.updateAvatar();

    const formData = new FormData();
    Object.keys(this.newPlayer).forEach(key => {
      if (this.newPlayer[key] !== null && this.newPlayer[key] !== undefined) {
        if (key !== 'image') { // Don't append existing image URL string
          formData.append(key, this.newPlayer[key]);
        }
      }
    });

    if (this.selectedFile) {
      formData.set('image', this.selectedFile);
    }

    if (this.editMode && this.editingId) {
      this.data.updatePlayer(this.editingId, formData).subscribe(updated => {
        const idx = this.players.findIndex(p => p.id === this.editingId);
        if (idx !== -1) {
          this.players[idx] = updated;
          this.filterPlayers();
        }
      });
    } else {
      this.data.addPlayer(formData).subscribe(p => {
        this.players.push(p);
        this.filterPlayers();
      });
    }
    this.filterPlayers();
    this.closeModal();
  }

  deletePlayer(id?: number) {
    if (id && confirm('Remove this player?')) {
      this.data.deletePlayer(id).subscribe(() => {
        this.players = this.players.filter(p => p.id !== id);
        this.filterPlayers();
      });
    }
  }
}
