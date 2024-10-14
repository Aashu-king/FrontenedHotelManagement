import { Component } from '@angular/core';
import { TableResrvationComponent } from '../table-resrvation.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-tables-resvation-list',
  templateUrl: './tables-resvation-list.component.html',
  styleUrl: './tables-resvation-list.component.css'
})
export class TablesResvationListComponent {
  justTableData: any[] = [];
  paginatedData: any[] = []; 
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
    this.paginatedData = this.justTableData.slice(startIndex, endIndex);
  }

  getData() {
    this.http.get('http://localhost:3000/api/v1/table/reservations').subscribe((result: any) => {
      console.log("🚀 ~ TablesResvationListComponent ~ this.http.get ~ result:", result)
      this.justTableData = result;
      if (this.justTableData.length > 0) {
        this.setPaginatedData();
      }
    });
  }

  openDialog(): void {
    this.dialog.open(TableResrvationComponent, {
      height: '80%',
      width: '80%',
      panelClass: 'custom-dialog-container',
      position: { left: '280px', top: '60px' }
    });
  }

  openDialogForUpdate(reservationId: number): void {
    this.dialog.open(TableResrvationComponent, {
      height: '80%',
      width: '80%',
      data: { reservationId: reservationId },
      panelClass: 'custom-dialog-container',
      position: { left: '280px', top: '60px' }
    });
  }

  getStatusClass(status: string): string {
    return status === 'Confirmed' ? 'status active' :
           status === 'Cancelled' ? 'status inactive' : 'status completed';
  }
}
