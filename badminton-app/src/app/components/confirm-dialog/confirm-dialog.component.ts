import { Component } from '@angular/core';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
    selector: 'app-confirm-dialog',
    template: `
<div class="confirm-overlay" *ngIf="dialog.state.visible" (click)="onOverlayClick($event)">
  <div class="confirm-box animate-scale-in">
    <div class="confirm-icon" [ngClass]="dialog.state.type">
      <span *ngIf="dialog.state.type === 'danger'">🗑️</span>
      <span *ngIf="dialog.state.type === 'warning'">⚠️</span>
      <span *ngIf="dialog.state.type === 'info'">ℹ️</span>
    </div>
    <h3 class="confirm-title">{{ dialog.state.title }}</h3>
    <p class="confirm-message">{{ dialog.state.message }}</p>
    <div class="confirm-actions">
      <button class="btn-cancel" (click)="dialog.close(false)">{{ dialog.state.cancelText }}</button>
      <button class="btn-confirm" [ngClass]="dialog.state.type" (click)="dialog.close(true)">{{ dialog.state.confirmText }}</button>
    </div>
  </div>
</div>
  `,
    styles: [`
    .confirm-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .confirm-box {
      background: #1a1f35;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 36px 32px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    }

    .confirm-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin: 0 auto 20px;

      &.danger { background: rgba(239, 68, 68, 0.15); }
      &.warning { background: rgba(245, 158, 11, 0.15); }
      &.info { background: rgba(59, 130, 246, 0.15); }
    }

    .confirm-title {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 10px;
      font-family: 'Inter', sans-serif;
    }

    .confirm-message {
      font-size: 14px;
      color: #a0aec0;
      margin-bottom: 28px;
      line-height: 1.6;
    }

    .confirm-actions {
      display: flex;
      gap: 12px;

      button {
        flex: 1;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;

        &:hover { transform: translateY(-1px); }
        &:active { transform: translateY(0); }
      }
    }

    .btn-cancel {
      background: rgba(255, 255, 255, 0.08);
      color: #a0aec0;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;

      &:hover { background: rgba(255, 255, 255, 0.12); color: #fff; }
    }

    .btn-confirm {
      color: #fff;
      font-weight: 700;

      &.danger {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
      }

      &.warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
      }

      &.info {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
      }
    }
  `]
})
export class ConfirmDialogComponent {
    constructor(public dialog: ConfirmDialogService) { }

    onOverlayClick(event: MouseEvent) {
        if ((event.target as HTMLElement).classList.contains('confirm-overlay')) {
            this.dialog.close(false);
        }
    }
}
