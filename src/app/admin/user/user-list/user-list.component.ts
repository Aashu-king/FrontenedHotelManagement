import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserComponent } from '../user.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
     
  justHotelData : any[] = []
  constructor(private http : HttpClient, public dialog: MatDialog,){

  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.http.get('http://localhost:3000/api/v1/getUser').subscribe((result : any) => {
      this.justHotelData = result
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.justHotelData)
    })
  }

  openDialog(): void {
    this.dialog.open(UserComponent, {
     height: '80%',
     width: '80%',
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }
}
