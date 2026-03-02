import { Component, OnInit } from '@angular/core';
import { DataService, Payment } from '../../services/data.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  isLoading = false;
  playerNames: string[] = [];
  statusFilter = '';

  totalCollected = 0;
  totalPending = 0;
  pendingCount = 0;
  collectionRate = 0;

  constructor(private data: DataService, private confirmDialog: ConfirmDialogService, private dialog: MatDialog) { }

  ngOnInit() {
    this.isLoading = true;
    this.data.getPayments().subscribe(payments => {
      this.payments = payments;
      this.computeStats();
      this.filterPayments();
      this.isLoading = false;
    });
    this.data.getPlayers().subscribe(players => {
      this.playerNames = players.map(p => p.name);
    });
  }

  defaultPayment() {
    return {
      player: '', amount: 0, type: '', date: new Date().toISOString().split('T')[0],
      status: 'Paid', method: 'UPI', reference: ''
    };
  }

  computeStats() {
    this.totalCollected = this.payments.filter(p => p.status === 'Paid').reduce((a, b) => a + b.amount, 0);
    this.totalPending = this.payments.filter(p => p.status !== 'Paid').reduce((a, b) => a + b.amount, 0);
    this.pendingCount = this.payments.filter(p => p.status !== 'Paid').length;
    this.collectionRate = this.payments.length > 0 ? Math.round((this.payments.filter(p => p.status === 'Paid').length / this.payments.length) * 100) : 0;
  }

  filterPayments() {
    this.filteredPayments = this.statusFilter ? this.payments.filter(p => p.status === this.statusFilter) : [...this.payments];
  }

  openModal() {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '580px',
      panelClass: 'custom-dialog-container',
      data: { payment: this.defaultPayment(), editMode: false, playerNames: this.playerNames }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const ref = result.reference?.trim() || ('TXN' + Math.floor(Math.random() * 999999).toString().padStart(6, '0'));
        const payment: Omit<Payment, 'id'> = {
          player: result.player, amount: result.amount, type: result.type,
          date: result.date, status: result.status,
          method: result.status === 'Paid' ? result.method : '-',
          reference: result.status === 'Paid' ? ref : '-',
        };
        this.data.addPayment(payment).subscribe(payments => {
          this.payments = payments;
          this.computeStats();
          this.filterPayments();
        });
      }
    });
  }

  markPaid(payment: Payment) {
    payment.status = 'Paid';
    payment.date = new Date().toISOString().split('T')[0];
    payment.method = 'Cash';
    payment.reference = 'TXN' + Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    this.computeStats();
    this.filterPayments();
  }

  async deletePayment(id?: number) {
    if (!id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Payment Record',
      message: 'Are you sure you want to delete this payment record? This cannot be undone.',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    if (confirmed) {
      this.data.deletePayment(id).subscribe(payments => {
        this.payments = payments;
        this.computeStats();
        this.filterPayments();
      });
    }
  }

  getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
  getStatusClass(status: string) {
    return { 'badge-success': status === 'Paid', 'badge-warning': status === 'Pending', 'badge-danger': status === 'Overdue' };
  }
  getStatusIcon(status: string) {
    return status === 'Paid' ? '✅' : status === 'Pending' ? '⏳' : '🚨';
  }
  getMethodIcon(method: string) {
    const icons: any = { 'UPI': '📱', 'Card': '💳', 'Cash': '💵', 'Bank Transfer': '🏦', 'Cheque': '📄' };
    return icons[method] || '💰';
  }
}

