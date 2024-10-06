import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RolePermissionComponent } from '../role-permission.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-permission-list',
  templateUrl: './role-permission-list.component.html',
  styleUrl: './role-permission-list.component.css'
})
export class RolePermissionListComponent {
  pageurl : any;
  justHotelData : any[] = []
  permissionArray : any 
  constructor(private http : HttpClient, public dialog: MatDialog,private router : Router){

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
    this.http.get('http://localhost:3000/api/v1/roleperm').subscribe((result : any) => {
      this.justHotelData = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.justHotelData)
    })

  }

  openDialog(): void {
    this.dialog.open(RolePermissionComponent, {
     height: '80%',
     width: '80%',
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }
}
