import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface PaymentDialogData {
    payment: any;
    editMode: boolean;
    playerNames: string[];
}

@Component({
    selector: 'app-payment-dialog',
    templateUrl: './payment-dialog.component.html',
    styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent {
    payment: any;
    editMode: boolean;
    playerNames: string[];
    formError = '';

    constructor(
        public dialogRef: MatDialogRef<PaymentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PaymentDialogData
    ) {
        this.payment = { ...data.payment };
        this.editMode = data.editMode;
        this.playerNames = data.playerNames;
    }

    onSave() {
        this.formError = '';
        if (!this.payment.player) { this.formError = 'Please select a player.'; return; }
        if (!this.payment.type) { this.formError = 'Please select a payment type.'; return; }
        if (!this.payment.amount || this.payment.amount <= 0) { this.formError = 'Please enter a valid amount.'; return; }
        this.dialogRef.close(this.payment);
    }

    onCancel() {
        this.dialogRef.close(null);
    }
}
