import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
    text: string;
    type: 'success' | 'error' | 'info';
    icon: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    toast$ = new Subject<ToastMessage>();

    success(text: string) {
        this.toast$.next({ text, type: 'success', icon: '✅' });
    }

    error(text: string) {
        this.toast$.next({ text, type: 'error', icon: '🚨' });
    }

    info(text: string) {
        this.toast$.next({ text, type: 'info', icon: 'ℹ️' });
    }
}
