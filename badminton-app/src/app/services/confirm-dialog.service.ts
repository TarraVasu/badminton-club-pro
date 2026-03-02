import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { firstValueFrom } from 'rxjs';

export interface ConfirmDialogOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
    constructor(private dialog: MatDialog) { }

    async confirm(options: ConfirmDialogOptions): Promise<boolean> {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '420px',
            data: options,
            panelClass: 'confirm-dialog-panel'
        });

        return await firstValueFrom(dialogRef.afterClosed()) || false;
    }
}

