import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageComponent } from '../page.component';

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
  styleUrl: './page-list.component.css'
})
export class PageListComponent {
   
  justHotelData : any[] = []
  constructor(private http : HttpClient, public dialog: MatDialog){

  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.http.get('http://localhost:3000/api/v1/get-page').subscribe((result : any) => {
      this.justHotelData = result
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.justHotelData)
    })
  }

  openDialog(): void {
    this.dialog.open(PageComponent, {
     height: '80%',
     width: '80%',
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }

  openDialogForUpdate(id : any): void {
    this.dialog.open(PageComponent, {
     height: '80%',
     width: '80%',
     data : id,
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }
}
