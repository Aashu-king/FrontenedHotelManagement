import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReservationComponent } from '../reservation.component';
import { BillDetailComponent } from '../../bill-detail/bill-detail.component';
import { CheckinComponent } from '../../checkin/checkin.component';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css'
})
export class ReservationListComponent {
 
  justHotelData : any[] = []
  paymentStatus : any
  outletid: any[] = [];
  constructor(private http : HttpClient, public dialog: MatDialog,){

  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.http.get(`http://localhost:3000/api/v1/reservations`).subscribe((result : any) => {
      this.justHotelData = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.justHotelData)
    })
    // this.http.get(`http://localhost:3000/api/v1/paymentStatus`).subscribe((result : any) => {
    //    this.paymentStatus = result.data
    //   console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.paymentStatus)
    // })
  }

  openDialog(): void {
    this.dialog.open(ReservationComponent, {
     height: '80%',
     width: '80%',
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }
  
  openDialogForUpdate(id : any): void {
    this.dialog.open(ReservationComponent, {
     height: '80%',
     width: '80%',
     data : id,
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }

  openDialogForPayment(id : any,event : any): void {
    event.stopPropagation();  

    const params = new HttpParams()
    .set('reservationId', id)
    this.http.get(`http://localhost:3000/api/v1/paymentStatus`,{params}).subscribe((result : any) => {
       this.paymentStatus = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", this.paymentStatus)
      if(this.paymentStatus){
        this.dialog.open(BillDetailComponent, {
          height: '80%',
          width: '80%',
          data : {id : id,paymentStatus : this.paymentStatus},
          panelClass: 'custom-dialog-container',
          position: { left: '280px', top: '60px' }
         });
      }
    })

  }

  openDialogForCheckIn(reservationId : any,roomId :any , outletid : any,event : any): void {
    event.stopPropagation();  

    this.dialog.open(CheckinComponent, {
     height: '80%',
     width: '80%',
     data : {reservationId : reservationId,roomId : roomId, outletid : outletid},
     panelClass: 'custom-dialog-container',
     position: { left: '280px', top: '60px' }
    });
  }
}
