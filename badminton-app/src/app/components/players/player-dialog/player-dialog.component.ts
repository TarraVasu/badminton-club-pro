import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from '../../../services/data.service';

@Component({
    selector: 'app-player-dialog',
    templateUrl: './player-dialog.component.html',
    styleUrls: ['./player-dialog.component.scss']
})
export class PlayerDialogComponent implements OnInit {
    editMode: boolean;
    player: any;
    formError = '';
    selectedFile: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;
    selectedColorIdx = 0;

    get previewColor() {
        return this.colorOptions[this.selectedColorIdx];
    }

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

    constructor(
        public dialogRef: MatDialogRef<PlayerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { player: Player, editMode: boolean }
    ) {
        this.player = { ...data.player };
        this.editMode = data.editMode;
        this.imagePreview = this.player.image || null;
    }

    ngOnInit(): void { }

    selectColor(i: number) {
        this.selectedColorIdx = i;
    }

    updateAvatar() {
        const parts = this.player.name.trim().split(' ');
        this.player.avatar = parts.map((n: string) => n[0] || '').join('').substring(0, 2).toUpperCase();
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

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        this.formError = '';
        if (!this.player.name.trim()) { this.formError = 'Full name is required.'; return; }

        const email = (this.player.email || '').trim();
        if (!email) { this.formError = 'Email address is required.'; return; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { this.formError = 'Please enter a valid email address.'; return; }

        const phone = (this.player.phone || '').trim();
        if (phone && !/^[0-9]{10}$/.test(phone)) { this.formError = 'Phone number must be exactly 10 digits.'; return; }

        if (!this.player.level) { this.formError = 'Please select a skill level.'; return; }

        this.updateAvatar();

        // Return the player data and the selected file
        this.dialogRef.close({ player: this.player, file: this.selectedFile });
    }
}
