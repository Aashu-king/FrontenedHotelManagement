import { Component } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.css'
})
export class MenuListComponent {

  menuData: any[] = [];
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
    this.paginatedData = this.menuData.slice(startIndex, endIndex);
  }

  getData() {
    this.http.get('http://localhost:3000/api/v1/menu').subscribe((result: any) => {
      this.menuData = result;
      if (this.menuData.length > 0) {
        this.setPaginatedData();
      }
    });
  }

  openDialog(): void {
    this.dialog.open(MenuComponent, {
      height: '80%',
      width: '80%',
      panelClass: 'custom-dialog-container',
      position: { left: '280px', top: '60px' }
    });
  }

  openDialogForUpdate(menuItemId: number): void {
    this.dialog.open(MenuComponent, {
      height: '80%',
      width: '80%',
      data: { menu_item_id: menuItemId },
      panelClass: 'custom-dialog-container',
      position: { left: '280px', top: '60px' }
    });
  }
}
