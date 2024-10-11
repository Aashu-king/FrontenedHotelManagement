import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CheckinComponent } from '../checkin/checkin.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-room-info',
  templateUrl: './room-info.component.html',
  styleUrl: './room-info.component.css'
})
export class RoomInfoComponent implements OnInit{
  searchForm !: FormGroup
  theDataWeGotForRoom: any
  reservationData : any
  paginatedDataForRoom: any[] = []; 
  pageSize = 5;
  currentPage = 0;
  pageSizeRes = 5;
  currentPageRes = 0;
  paginatedDataForReserVation: any[] = []; 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,private http : HttpClient,public dialog: MatDialog,private fb : FormBuilder){}


  ngOnInit(): void {

    this.searchForm = this.fb.group({
      firstName : [''],
      lastName : ['']
    })
    if(this.data && this.data.value === 'toOpenCalendar' || this.data.value === 'toOpenGuestManagement'){
      this.getData()
      console.log("🚀 ~ RoomInfoComponent ~ ngOnInit ~ this.data.formattedDate:", this.data.formattedDate)
    }

    this.searchForm.get('firstName')?.valueChanges.subscribe((ele) => {
      this.getData()
    })
    this.searchForm.get('lastName')?.valueChanges.subscribe((ele) => {
      this.getData()
    })

    
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
    console.log("🚀 ~ RoomInfoComponent ~ setPaginatedDataForRes ~ this.paginatedDataForReserVation:", this.paginatedDataForReserVation)
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
    console.log('yo');
    
    if(this.data.value === 'toOpenCalendar'){
      console.log("🚀 ~ RoomInfoComponent ~ getData ~  this.data.formattedDate:",  this.data.formattedDate)
      const params = new HttpParams()
      .set('theDate' , this.data.formattedDate)
      this.http.get('http://localhost:3000/api/v1/theDate',{params}).subscribe((result : any) => {
        this.theDataWeGotForRoom = result.availableRooms.data
        if(this.theDataWeGotForRoom.length){
          this.setPaginatedData();
        }
        this.reservationData = result.reservedRooms.data
        console.log("🚀 ~ RoomInfoComponent ~ this.http.get ~ this.reservationData:", this.reservationData)
        if(this.reservationData.length){
          this.setPaginatedDataForRes();
        }
        console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.theDataWeGotForRoom)
      })
    }else if(this.data.value === 'toOpenGuestManagement'){
      const params = new HttpParams()
      .set('firstName' , this.searchForm.get('firstName')?.value)
      .set('lastName' , this.searchForm.get('lastName')?.value)
      this.http.get('http://localhost:3000/api/v1/theGuestData',{params}).subscribe((result : any) => {
        this.theDataWeGotForRoom = result
        console.log("🚀 ~ RoomInfoComponent ~ this.http.get ~ this.theDataWeGotForRoom:", this.theDataWeGotForRoom)
        if(this.theDataWeGotForRoom){
          this.setPaginatedData();
        }
        console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.theDataWeGotForRoom)
      })
    }
   
  }

  openDialog(id : any): void {
    this.dialog.open(CheckinComponent, {
     height: '80%',
     width: '80%',
     data : id,
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }
}
