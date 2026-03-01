import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ScrollService } from './scroll.service';

export interface ConfirmDialogOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export interface ConfirmDialogState extends ConfirmDialogOptions {
    visible: boolean;
    resolve?: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
    constructor(private scroll: ScrollService) { }
    state: ConfirmDialogState = {
        visible: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'danger'
    };

    confirm(options: ConfirmDialogOptions): Promise<boolean> {
        this.scroll.disableScroll();
        return new Promise((resolve) => {
            this.state = {
                ...options,
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                type: options.type || 'danger',
                visible: true,
                resolve
            };
        });
    }

    close(result: boolean) {
        if (this.state.resolve) {
            this.state.resolve(result);
        }
        this.state = { ...this.state, visible: false };
        this.scroll.enableScroll();
    }
}
