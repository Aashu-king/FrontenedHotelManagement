import { Component } from '@angular/core';
import { ModuleComponent } from '../module.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-module-list',
  templateUrl: './module-list.component.html',
  styleUrl: './module-list.component.css'
})
export class ModuleListComponent {

  
  justHotelData : any[] = []
  constructor(private http : HttpClient, public dialog: MatDialog,){

  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.http.get('http://localhost:3000/api/v1/get-hotel').subscribe((result : any) => {
      this.justHotelData = result
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.justHotelData)
    })
  }

  openDialog(): void {
    this.dialog.open(ModuleComponent, {
     height: '80%',
     width: '80%',
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '-100px' }
    });
  }
}
