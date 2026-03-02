import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface SessionDialogData {
    session: any;
    editMode: boolean;
}

@Component({
    selector: 'app-session-dialog',
    templateUrl: './session-dialog.component.html',
    styleUrls: ['./session-dialog.component.scss']
})
export class SessionDialogComponent {
    session: any;
    editMode: boolean;
    formError = '';

    constructor(
        public dialogRef: MatDialogRef<SessionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SessionDialogData
    ) {
        this.session = { ...data.session };
        this.editMode = data.editMode;
    }

    onSave() {
        this.formError = '';
        if (!this.session.title?.trim()) { this.formError = 'Session title is required.'; return; }
        if (!this.session.type) { this.formError = 'Please select a session type.'; return; }
        if (!this.session.date) { this.formError = 'Date is required.'; return; }
        if (!this.session.court) { this.formError = 'Please select a court.'; return; }
        this.dialogRef.close(this.session);
    }

    onCancel() {
        this.dialogRef.close(null);
    }
}
