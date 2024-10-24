import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HotelComponent } from '../hotel.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ImageUploaderComponent } from '../../image-uploader/image-uploader.component';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.css'
})
export class HotelListComponent implements OnInit{
  pageurl : any;
  justHotelData : any[] = []
  permissionArray : any 
  paginatedData: any[] = []; 
  pageSize = 10;
  currentPage = 0;
  constructor(private http : HttpClient, public dialog: MatDialog,private router : Router){

  }

  ngOnInit(): void {
    this.getData();
     
    this.pageurl =  this.router.url.split('/')[2]
    console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl:", this.pageurl)
    // console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl.split('/'):", this.pageurl.split('/'))

    this.http.get('http://localhost:3000/api/v1/getPerm').subscribe((result : any) => {
      this.permissionArray = result.Permissions.find((ele : any) => ele.page.pageUrl == `/${this.pageurl}`)
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.permissionArray)
    })
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
    this.http.get('http://localhost:3000/api/v1/get-hotel').subscribe((result : any) => {
      this.justHotelData = result
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.justHotelData)
      if(this.justHotelData.length > 0){
        this.setPaginatedData();
  
      }
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.justHotelData)
    })
  }

  openDialog(): void {
    this.dialog.open(HotelComponent, {
     height: '80%',
     width: '80%',
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }

  openDialogForUpdate(id : any): void {
    console.log("🚀 ~ ModuleListComponent ~ openDialogForUpdate ~ id:", id)
    this.dialog.open(HotelComponent, {
     height: '80%',
     width: '80%',
     data : id,
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }

  openDialogImageUpload(id : any): void {
    console.log("🚀 ~ ModuleListComponent ~ openDialogForUpdate ~ id:", id)
    this.dialog.open(ImageUploaderComponent, {
     height: '80%',
     width: '80%',
     data : {hotelid : id, forWhichImage : 'hotel'},
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }
  openDialogImageUploadForUpdate(id : any,imageId : any,imageName : any): void {
    console.log("🚀 ~ HotelListComponent ~ openDialogImageUploadForUpdate ~ imageName:", imageName)
    console.log("🚀 ~ HotelListComponent ~ openDialogImageUploadForUpdate ~ imageId:", imageId)
    console.log("🚀 ~ HotelListComponent ~ openDialogImageUploadForUpdate ~ id:", id)
   let dialogRef =  this.dialog.open(ImageUploaderComponent, {
     height: '60%',
     width: '40%',
     data : {hotelid : id, forWhichImage : 'hotel',imageId : imageId,imageName : imageName},
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getData()
    })
  }
  
}
