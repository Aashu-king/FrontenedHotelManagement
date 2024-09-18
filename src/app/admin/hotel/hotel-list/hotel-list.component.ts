import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.css'
})
export class HotelListComponent implements OnInit{

  justHotelData : any[] = []
  constructor(private http : HttpClient){

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

  addNewPage() {
    // Add your logic for adding a new page here, for example, navigation or opening a modal
    console.log('Add New Page button clicked');
  }
  
}
