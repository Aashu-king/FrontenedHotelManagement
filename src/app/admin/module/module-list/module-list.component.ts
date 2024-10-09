import { Component } from '@angular/core';
import { ModuleComponent } from '../module.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-module-list',
  templateUrl: './module-list.component.html',
  styleUrl: './module-list.component.css'
})
export class ModuleListComponent {
  pageurl : any;
  justHotelData : any[] = []
  permissionArray : any 
  paginatedData: any[] = []; 
  pageSize = 10;
  currentPage = 0;
  constructor(private http : HttpClient, public dialog: MatDialog,private router : Router){

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

  ngOnInit(): void {
    this.getData();
     
    this.pageurl =  this.router.url.split('/')[2]
    console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl:", this.pageurl)
    // console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl.split('/'):", this.pageurl.split('/'))

    this.http.get('http://localhost:3000/api/v1/getPerm').subscribe((result : any) => {
      this.permissionArray = result.Permissions.find((ele : any) => ele.page.pageUrl == `/${this.pageurl}`)
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",typeof this.permissionArray)
    })
  }

  getData(){
    this.http.get('http://localhost:3000/api/v1/get-module').subscribe((result : any) => {
      this.justHotelData = result
      if(this.justHotelData.length > 0){
        this.setPaginatedData();
  
      }
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.justHotelData)
    })
  }

  openDialog(): void {
    this.dialog.open(ModuleComponent, {
     height: '80%',
     width: '80%',
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }
  openDialogForUpdate(id : any): void {
    console.log("🚀 ~ ModuleListComponent ~ openDialogForUpdate ~ id:", id)
    this.dialog.open(ModuleComponent, {
     height: '80%',
     width: '80%',
     data : id,
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }
}
