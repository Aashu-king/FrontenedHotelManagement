import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { OrderItemsComponent } from '../order-items.component';

@Component({
  selector: 'app-order-item-list',
  templateUrl: './order-item-list.component.html',
  styleUrl: './order-item-list.component.css'
})
export class OrderItemListComponent {
  orderItems: any[] = [];  // Full data from the server
  paginatedData: any[] = [];  // Paginated data
  pageSize = 10;
  currentPage = 0;

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getData();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setPaginatedData();
  }

  setPaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.orderItems.slice(startIndex, endIndex);
  }

  getData() {
    this.http.get('http://localhost:3000/api/v1/order-items').subscribe((result: any) => {
      this.orderItems = result;
      console.log("🚀 ~ OrderItemListComponent ~ this.http.get ~ result:", result)
      this.setPaginatedData();
    });
  }

  openDialog(): void {
    this.dialog.open(OrderItemsComponent, {
      height: '80%',
      width: '80%',
      panelClass: 'custom-dialog-container',
      position: { left: '280px', top: '60px' }
    });
  }

  openDialogForUpdate(order_item_id: any): void {
    this.dialog.open(OrderItemsComponent, {
      height: '80%',
      width: '80%',
      data: order_item_id ,
      panelClass: 'custom-dialog-container',
      position: { left: '280px', top: '60px' }
    });
  }

  deleteReservation(order_item_id: any) {
    if (confirm("Are you sure you want to delete this reservation?")) {
      this.http.delete(`http://localhost:3000/api/v1/order-items/${order_item_id}`).subscribe(() => {
        this.getData();  // Refresh data after deletion
      });
    }
  }
}
