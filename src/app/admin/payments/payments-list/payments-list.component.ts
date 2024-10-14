import { Component } from '@angular/core';
import { PaymentsComponent } from '../payments.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.css'
})
export class PaymentsListComponent {
  paymentData: any[] = [];
  paginatedData: any[] = [];
  pageSize = 10;
  currentPage = 0;

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getPayments();
  }

  getPayments() {
    this.http.get('http://localhost:3000/api/v1/payments').subscribe((result: any) => {
      this.paymentData = result;
      if (this.paymentData.length > 0) {
        this.setPaginatedData();
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setPaginatedData();
  }

  setPaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.paymentData.slice(startIndex, endIndex);
  }

  openDialog(): void {
    this.dialog.open(PaymentsComponent, {
      height: '80%',
      width: '80%',
      panelClass: 'custom-dialog-container',
      position: { left: '280px', top: '60px' }
    });
  }

  openDialogForUpdate(paymentId: any): void {
    this.dialog.open(PaymentsComponent, {
      height: '80%',
      width: '80%',
      data: { paymentId },
      panelClass: 'custom-dialog-container',
      position: { left: '280px', top: '60px' }
    });
  }
}
