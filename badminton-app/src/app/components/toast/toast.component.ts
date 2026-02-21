import { Component, OnInit } from '@angular/core';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    template: `
    <div class="toast-container">
      <div *ngFor="let t of toasts; let i = index" 
           class="toast slide-in"
           [ngClass]="'toast-' + t.type">
        <span class="toast-icon">{{ t.icon }}</span>
        <span class="toast-text">{{ t.text }}</span>
        <button class="toast-close" (click)="remove(i)">✕</button>
      </div>
    </div>
  `,
    styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
    toasts: ToastMessage[] = [];

    constructor(private toastService: ToastService) { }

    ngOnInit() {
        this.toastService.toast$.subscribe(msg => {
            this.toasts.push(msg);
            setTimeout(() => this.remove(0), 3500); // auto-dismiss after 3.5s
        });
    }

    remove(index: number) {
        if (this.toasts.length > index) {
            this.toasts.splice(index, 1);
        }
    }
}
