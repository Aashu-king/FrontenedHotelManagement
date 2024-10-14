import { Component } from '@angular/core';
import { OrdersComponent } from '../orders.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { PaymentsComponent } from '../../payments/payments.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {
  orderData: any[] = [];
  paginatedData: any[] = [];
  pageSize = 10;
  currentPage = 0;

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.http.get('http://localhost:3000/api/v1/reorders').subscribe((result: any) => {
      this.orderData = result;
      console.log("🚀 ~ OrderListComponent ~ this.http.get ~ this.orderData:", this.orderData)
      if (this.orderData.length > 0) {
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
    this.paginatedData = this.orderData.slice(startIndex, endIndex);
  }

  openDialog(): void {
    this.dialog.open(OrdersComponent, {
      height: '80%',
      width: '80%',
      panelClass: 'custom-dialog-container',
      position: { left: '280px', top: '60px' }
    });
  }

  openDialogForUpdate(orderId: any,isBillsettled : any): void {
    console.log("🚀 ~ OrderListComponent ~ openDialogForUpdate ~ isBillsettled:", isBillsettled)
    this.dialog.open(OrdersComponent, {
      height: '80%',
      width: '80%',
      data: { orderId : orderId ,isBillsettled : isBillsettled},
      panelClass: 'custom-dialog-container',
      position: { left: '280px', top: '60px' }
    });
  }

  openDialogForPayments(order_id :any,guestId : any,order_date : any,total_amount : any): void {
    let obj = {
      order_id : order_id,
      guestId : guestId,
      payment_date : order_date,
      amount : total_amount,
      payment_method : 'Cash',
      is_settled : false
    }
    const dialogRef = this.dialog.open(PaymentsComponent, {
      height: '80%',
      width: '80%',
      data: {throughorder : true, obj : obj},
      panelClass: 'custom-dialog-container',
      position: { left: '280px', top: '60px' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isSettled !== undefined) {
        console.log('Payment settled:', result.isSettled);
        // this.isBillsettled = result.settled
        this.updateOrderSettlementStatus(order_id, result.isSettled);
      }
    });
    
  }

  private updateOrderSettlementStatus(orderId: any, isSettled: boolean) {
    console.log(`Updating order ${orderId} settlement status to ${isSettled}`);
  }
}
