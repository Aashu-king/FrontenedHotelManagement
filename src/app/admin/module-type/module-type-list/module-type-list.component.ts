import { Component } from '@angular/core';
import { ModuleTypeComponent } from '../module-type.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-module-type-list',
  templateUrl: './module-type-list.component.html',
  styleUrl: './module-type-list.component.css'
})
export class ModuleTypeListComponent {
  
  justHotelData : any[] = []
  constructor(private http : HttpClient, public dialog: MatDialog,){

  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.http.get('http://localhost:3000/api/v1/get-moduletype').subscribe((result : any) => {
      this.justHotelData = result
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.justHotelData)
    })
  }

  openDialog(): void {
    this.dialog.open(ModuleTypeComponent, {
     height: '80%',
     width: '80%',
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }

  openDialogForUpdate(id : any): void {
    this.dialog.open(ModuleTypeComponent, {
     height: '80%',
     width: '80%',
     data : id,
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }
}
