import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.css'
})
export class CheckinComponent {
  checkInForm!: FormGroup;
  permissionArray : any 
  pageurl : any;
  outlets : any;
  roomTypes : any;
  reservationsData : any;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<CheckinComponent>,private http: HttpClient,private router : Router,@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.getDropdown();
    this.checkInForm = this.fb.group({
      reservationId: ['', [Validators.required]],
      checkInTime: ['', [Validators.required]],
      assignedRoomId: ['', [Validators.required]],
      additionalRequests: [''],
      outletid: ['', [Validators.required]],
    });

    this.pageurl =  this.router.url.split('/')[2]
    console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl:", this.pageurl)
    // console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl.split('/'):", this.pageurl.split('/'))

    this.http.get('http://localhost:3000/api/v1/getPerm').subscribe((result : any) => {
      this.permissionArray = result.Permissions.find((ele : any) => ele.page.pageUrl == `/${this.pageurl}`)
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.permissionArray)
    })

    if(this.data.reservationId && this.data.roomId && this.data.outletid){
      this.setValueFromReservation()
    }
    this.getDataById()
  }

  getDataById(){
    this.http.get(`http://localhost:3000/api/v1/check-in/${this.data.checkInId}`, this.checkInForm.value).subscribe(
      (response : any) => {
        console.log('Success ======>!', response);
        this.outlets = response

        if(this.outlets) {
          this.checkInForm.get('reservationId')?.setValue(this.outlets.reservationId)
          this.checkInForm.get('address')?.setValue(this.outlets.address)
          this.checkInForm.get('city')?.setValue(this.outlets.city)
          this.checkInForm.get('state')?.setValue(this.outlets.state)
        }
      }
    );
  }

  setValueFromReservation(){
    if(this.data.reservationId && this.data.roomId && this.data.outletid){
      this.checkInForm.get('reservationId')?.setValue(this.data.reservationId)
      this.checkInForm.get('assignedRoomId')?.setValue(this.data.roomId)
      this.checkInForm.get('outletid')?.setValue(this.data.outletid)
    }
  }

  getDropdown(){
    console.log('yooo');
    
    this.http.get('http://localhost:3000/api/v1/dropdown-outlets').subscribe(
      (response : any) => {
        console.log('Success!', response);
        this.outlets = response
      }
    );
    this.http.get('http://localhost:3000/api/v1/dropdown-rooms').subscribe(
      (response : any) => {
        console.log('Success!', response);
        this.roomTypes = response
      }
    );
    this.http.get('http://localhost:3000/api/v1/dropdown-reservations').subscribe(
      (response : any) => {
        console.log('Success!', response);
        this.reservationsData = response
      }
    );
  }

  onSubmit() {
    if(!this.data) {
      if (this.checkInForm.valid) {
        console.log(this.checkInForm.value);
        this.http.post('http://localhost:3000/api/v1/check-in', this.checkInForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    } else {
      if (this.checkInForm.valid) {
        console.log(this.checkInForm.value);
        console.log("🚀 ~ ModuleComponent ~ onSubmit ~ this.data:", this.data)
        this.http.put(`http://localhost:3000/api/v1/check-in/${this.data}`, this.checkInForm.value).subscribe(
          (response: any) => {
            console.log('Success!', response);
            this.dialogRef.close(true); 
          }
        );
      }
    }
   
  }

  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1/check-in/${this.data}`).subscribe(
      (response: any) => {
        console.log('Success!', response);
        this.dialogRef.close(true); 
      }
    );
  }
}
