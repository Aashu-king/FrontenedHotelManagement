import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../table.component'; // Adjust the path if necessary
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-tables-list',
  templateUrl: './tables-list.component.html',
  styleUrls: ['./tables-list.component.css']
})
export class TablesListComponent {
  justTableData: any[] = [];
  paginatedData: any[] = [];
  pageSize = 10;
  currentPage = 0;

  constructor(private http: HttpClient, public dialog: MatDialog) { }

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
    this.http.get('http://localhost:3000/api/v1/tables').subscribe((result: any) => {
      this.justTableData = result;
      if (this.justTableData.length > 0) {
        this.setPaginatedData();
      }
    });
  }

  openDialog(): void {
    this.dialog.open(TableComponent, {
      height: '80%',
      width: '80%',
      panelClass: 'custom-dialog-container',
      position: { left: '280px', top: '60px' }
    });
  }

  openDialogForUpdate(tableId: number): void {
    this.dialog.open(TableComponent, {
      height: '80%',
      width: '80%',
      data: { tableId: tableId },
      panelClass: 'custom-dialog-container',
      position: { left: '280px', top: '60px' }
    });
  }

  deleteTable(tableId: number): void {
    this.http.delete(`http://localhost:3000/api/v1/tables/${tableId}`).subscribe(() => {
      this.getData(); // Refresh the table list after deletion
    });
  }
}
