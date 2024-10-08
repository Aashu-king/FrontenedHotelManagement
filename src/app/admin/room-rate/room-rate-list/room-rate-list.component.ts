import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoomRateComponent } from '../room-rate.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-room-rate-list',
  templateUrl: './room-rate-list.component.html',
  styleUrl: './room-rate-list.component.css'
})
export class RoomRateListComponent {

  justHotelData : any[] = []
  paginatedData: any[] = []; 
  pageSize = 5;
  currentPage = 0;

  constructor(private http : HttpClient, public dialog: MatDialog,){

  }

  ngOnInit(): void {
    this.getData();
    console.log("🚀 ~ RoomRateListComponent ~ ngOnInit ~ this.justHotelData.length:", this.justHotelData.length)
   
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setPaginatedData();
  }

  setPaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    console.log("🚀 ~ RoomRateListComponent ~ setPaginatedData ~ startIndex:", startIndex)
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.justHotelData.slice(startIndex, endIndex);
    console.log("🚀 ~ RoomRateListComponent ~ setPaginatedData ~ this.paginatedData:", this.paginatedData)
  }

  getData(){
    this.http.get('http://localhost:3000/api/v1/roomRates').subscribe((result : any) => {
      this.justHotelData = result.data
      if(this.justHotelData.length > 0){
        this.setPaginatedData();
  
      }
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.justHotelData)
    })
  }

  openDialog(): void {
    this.dialog.open(RoomRateComponent, {
     height: '80%',
     width: '80%',
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }
  
  openDialogForUpdate(id : any): void {
    this.dialog.open(RoomRateComponent, {
     height: '80%',
     width: '80%',
     data : id,
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
}
}
