import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-info',
  templateUrl: './room-info.component.html',
  styleUrl: './room-info.component.css'
})
export class RoomInfoComponent implements OnInit{

  theDataWeGotForRoom: any
  reservationData : any
  paginatedDataForRoom: any[] = []; 
  pageSize = 5;
  currentPage = 0;
  pageSizeRes = 5;
  currentPageRes = 0;
  paginatedDataForReserVation: any[] = []; 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,private http : HttpClient){}


  ngOnInit(): void {
    if(this.data){
      this.getData()
    }

    
    console.log("🚀 ~ RoomInfoComponent ~ ngOnInit ~ this.data:", this.data)
  }
  selectedTab: string = 'table1';

  selectTab(tabId: string) {
    this.selectedTab = tabId; 
  }

  setPaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    console.log("🚀 ~ RoomRateListComponent ~ setPaginatedData ~ startIndex:", startIndex)
    const endIndex = startIndex + this.pageSize;
    this.paginatedDataForRoom = this.theDataWeGotForRoom.slice(startIndex, endIndex);
    console.log("🚀 ~ RoomRateListComponent ~ setPaginatedData ~ this.paginatedData:", this.paginatedDataForRoom)
  }

  setPaginatedDataForRes(){
    const startIndex = this.currentPageRes * this.pageSizeRes;
    console.log("🚀 ~ RoomRateListComponent ~ setPaginatedData ~ startIndex:", startIndex)
    const endIndex = startIndex + this.pageSizeRes;
    this.paginatedDataForReserVation = this.reservationData.slice(startIndex, endIndex);
    console.log("🚀 ~ RoomRateListComponent ~ setPaginatedData ~ this.paginatedData:", this.reservationData)
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setPaginatedData();
  }

  onPageChangeRes(event: PageEvent) {
    this.pageSizeRes = event.pageSize;
    this.currentPageRes = event.pageIndex;
    this.setPaginatedDataForRes();
  }

  getData(){
    const params = new HttpParams()
    .set('theDate' , this.data)
    console.log("🚀 ~ RoomInfoComponent ~ getData ~  this.data:",  this.data)

    this.http.get('http://localhost:3000/api/v1/theDate',{params}).subscribe((result : any) => {
      this.theDataWeGotForRoom = result.availableRooms.data
      if(this.theDataWeGotForRoom.length){
        this.setPaginatedData();
      }
      this.reservationData = result.reservedRooms.data
      if(this.reservationData.length){
        this.setPaginatedDataForRes();
      }
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.theDataWeGotForRoom)
    })
  }
}
