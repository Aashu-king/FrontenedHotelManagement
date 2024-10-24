import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoomComponent } from '../room.component';
import { PageEvent } from '@angular/material/paginator';
import { ImageUploaderComponent } from '../../image-uploader/image-uploader.component';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent {

  justHotelData : any[] = []
  paginatedData: any[] = []; 
  pageSize = 10;
  currentPage = 0;
  
  constructor(private http : HttpClient, public dialog: MatDialog,){

  }

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
    console.log("🚀 ~ RoomRateListComponent ~ setPaginatedData ~ startIndex:", startIndex)
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.justHotelData.slice(startIndex, endIndex);
    console.log("🚀 ~ RoomRateListComponent ~ setPaginatedData ~ this.paginatedData:", this.paginatedData)
  }

  getData(){
    this.http.get('http://localhost:3000/api/v1/rooms').subscribe((result : any) => {
      this.justHotelData = result.data
      if(this.justHotelData.length > 0){
        this.setPaginatedData();
  
      }
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.justHotelData)
    })
  }

  openDialog(): void {
    this.dialog.open(RoomComponent, {
     height: '80%',
     width: '80%',
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }

  openDialogForUpdate(id : any): void {
    this.dialog.open(RoomComponent, {
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
     data : {roomId : id, forWhichImage : 'room'},
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
     data : {roomId : id, forWhichImage : 'room',imageId : imageId,imageName : imageName},
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getData()
    })
  }
  
}
