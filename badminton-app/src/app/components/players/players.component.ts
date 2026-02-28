import { Component, OnInit } from '@angular/core';
import { DataService, Player } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private data: DataService, public auth: AuthService, private toast: ToastService, private confirmDialog: ConfirmDialogService) { }

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
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
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

  openModal() { this.showModal = true; this.editMode = false; this.newPlayer = this.defaultPlayer(); this.formError = ''; this.selectedFile = null; this.imagePreview = null; }
  openEditModal(p: Player) {
    this.editMode = true;
    this.showModal = true;
    this.editingId = p.id;
    this.newPlayer = { ...p };
    this.formError = '';
    this.selectedFile = null;
    this.imagePreview = p.image || null;
  }
  closeModal() { this.showModal = false; this.editingId = null; this.selectedFile = null; this.imagePreview = null; }

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
      this.data.updatePlayer(this.editingId, formData).subscribe(players => {
        this.players = players;
        this.filterPlayers();
      });
    } else {
      this.data.addPlayer(formData).subscribe(players => {
        this.players = players;
        this.filterPlayers();
      });
    }
    this.filterPlayers();
    this.closeModal();
  }

  async deletePlayer(id?: number) {
    if (!id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Remove Player',
      message: 'Are you sure you want to remove this player? This action cannot be undone.',
      confirmText: 'Yes, Remove',
      cancelText: 'Cancel',
      type: 'danger'
    });
    if (confirmed) {
      this.data.deletePlayer(id).subscribe(players => {
        this.players = players;
        this.filterPlayers();
      });
    }
  }

  exportToPDF() {
    this.toast.info('Generating PDF Report...');

    setTimeout(() => {
      try {
        const doc = new jsPDF();

        // Add Title and Brand
        doc.setFontSize(22);
        doc.setTextColor(0, 212, 170); // Primary color #00d4aa
        doc.text('🐾 Birdie Beasts', 14, 22);

        doc.setFontSize(16);
        doc.setTextColor(100);
        doc.text('Club Members Directory', 14, 32);

        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 40);

        // Define table columns
        const head = [['#', 'Player Name', 'Email', 'Level', 'Wins', 'Losses', 'Points', 'Rate']];

        // Prepare table data
        const body = this.filteredPlayers.map((p, i) => [
          i + 1,
          p.name,
          p.email,
          p.level,
          p.wins,
          p.losses,
          p.points,
          `${this.getWinRate(p)}%`
        ]);

        // Generate Table
        autoTable(doc, {
          head: head,
          body: body,
          startY: 45,
          theme: 'grid',
          headStyles: { fillColor: [0, 212, 170], textColor: [255, 255, 255], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          styles: { fontSize: 9, cellPadding: 3 },
          margin: { top: 45 },
          didDrawPage: (data) => {
            // Footer with page number
            const str = 'Page ' + (doc as any).internal.getNumberOfPages();
            doc.setFontSize(10);
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            doc.text(str, data.settings.margin.left, pageHeight - 10);
          }
        });

        // Save PDF
        doc.save(`Birdie_Beasts_Players_${new Date().toISOString().split('T')[0]}.pdf`);
        this.toast.success('PDF Exported Successfully!');
      } catch (err) {
        console.error('PDF Export Error:', err);
        this.toast.error('Failed to generate PDF');
      }
    }, 1000);
  }
}
