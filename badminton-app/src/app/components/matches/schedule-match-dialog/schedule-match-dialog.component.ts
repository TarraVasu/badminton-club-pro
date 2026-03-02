import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ScheduleMatchDialogData {
    match: any;
    playerNames: string[];
}

@Component({
    selector: 'app-schedule-match-dialog',
    templateUrl: './schedule-match-dialog.component.html',
    styleUrls: ['./schedule-match-dialog.component.scss']
})
export class ScheduleMatchDialogComponent {
    match: any;
    playerNames: string[];
    formError = '';

    constructor(
        public dialogRef: MatDialogRef<ScheduleMatchDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ScheduleMatchDialogData
    ) {
        this.match = { ...data.match };
        this.playerNames = data.playerNames;
    }

    onSave() {
        this.formError = '';
        if (!this.match.player1) { this.formError = 'Please select Player 1.'; return; }
        if (!this.match.player2) { this.formError = 'Please select Player 2.'; return; }
        if (this.match.player1 === this.match.player2) { this.formError = 'Players cannot be the same.'; return; }
        if (!this.match.date) { this.formError = 'Match date is required.'; return; }
        if (!this.match.court) { this.formError = 'Please select a court.'; return; }
        this.dialogRef.close(this.match);
    }

    onCancel() {
        this.dialogRef.close(null);
    }
}
