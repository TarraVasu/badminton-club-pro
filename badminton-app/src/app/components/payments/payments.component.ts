import { Component, OnInit } from '@angular/core';
import { DataService, Payment } from '../../services/data.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { ScrollService } from '../../services/scroll.service';

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
  showModal = false;
  editMode = false;
  formError = '';
  editingId: number | null = null;

  totalCollected = 0;
  totalPending = 0;
  pendingCount = 0;
  collectionRate = 0;

  statusOptions = [
    { value: 'Paid', icon: '✅', label: 'Paid' },
    { value: 'Pending', icon: '⏳', label: 'Pending' },
    { value: 'Overdue', icon: '🚨', label: 'Overdue' },
  ];

  newPayment: any = this.defaultPayment();

  constructor(private data: DataService, private confirmDialog: ConfirmDialogService, private scroll: ScrollService) { }

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

  openModal() { this.showModal = true; this.editMode = false; this.newPayment = this.defaultPayment(); this.formError = ''; this.scroll.disableScroll(); }

  closeModal() { this.showModal = false; this.editingId = null; this.scroll.enableScroll(); }

  savePayment() {
    this.formError = '';
    if (!this.newPayment.player) { this.formError = 'Please select a player.'; return; }
    if (!this.newPayment.type) { this.formError = 'Please select a payment type.'; return; }
    if (!this.newPayment.amount || this.newPayment.amount <= 0) { this.formError = 'Please enter a valid amount.'; return; }

    const ref = this.newPayment.reference?.trim() || ('TXN' + Math.floor(Math.random() * 999999).toString().padStart(6, '0'));
    const payment: Omit<Payment, 'id'> = {
      player: this.newPayment.player,
      amount: this.newPayment.amount,
      type: this.newPayment.type,
      date: this.newPayment.date,
      status: this.newPayment.status,
      method: this.newPayment.status === 'Paid' ? this.newPayment.method : '-',
      reference: this.newPayment.status === 'Paid' ? ref : '-',
    };
    this.data.addPayment(payment).subscribe(payments => {
      this.payments = payments;
      this.computeStats();
      this.filterPayments();
    });
    this.closeModal();
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
