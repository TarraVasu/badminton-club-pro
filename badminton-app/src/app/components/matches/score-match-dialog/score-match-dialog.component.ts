import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Match } from '../../../services/data.service';

export interface ScoreMatchDialogData {
    match: Match;
}

@Component({
    selector: 'app-score-match-dialog',
    templateUrl: './score-match-dialog.component.html',
    styleUrls: ['./score-match-dialog.component.scss']
})
export class ScoreMatchDialogComponent {
    match: any;

    constructor(
        public dialogRef: MatDialogRef<ScoreMatchDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ScoreMatchDialogData
    ) {
        this.match = { ...data.match };
    }

    onSave() {
        this.dialogRef.close(this.match);
    }

    onCancel() {
        this.dialogRef.close(null);
    }
}
