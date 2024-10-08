import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-rate',
  templateUrl: './room-rate.component.html',
  styleUrl: './room-rate.component.css'
})
export class RoomRateComponent {
  roomRateForm !: FormGroup;
  roomTypes = [
    { id: 1, name: 'Single' },
    { id: 2, name: 'Double' }
    // Add more room types as needed
  ];
  outlets = [
    { id: 1, name: 'Outlet 1' },
    { id: 2, name: 'Outlet 2' }
    // Add more outlets as needed
  ];

  dataArray : any
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RoomRateComponent>,private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {}

  ngOnInit(): void {
    this.roomRateForm = this.fb.group({
      rateId: [''],
      roomTypeId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      ratePerNight: ['', [Validators.required, Validators.min(0)]],
      outletid: ['', Validators.required]
    });

    if(this.data){
      this.getByIdData()
    }
  }

  onSubmit() {
    if (this.roomRateForm.valid) {
      console.log(this.roomRateForm.value);
      this.http.post('http://localhost:3000/api/v1/roomRate', this.roomRateForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
    if(!this.data){
      if (this.roomRateForm.valid) {
        console.log(this.roomRateForm.value);
        this.http.post('http://localhost:3000/api/v1/roomRate', this.roomRateForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }else{
      if (this.roomRateForm.valid) {
        console.log(this.roomRateForm.value);
        this.http.put(`http://localhost:3000/api/v1/roomRate/${this.data}`, this.roomRateForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }
  }

  getByIdData(){
    this.http.get(`http://localhost:3000/api/v1/roomRates/${this.data}`).subscribe((result : any) => {
      this.dataArray = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
      if(this.dataArray){
        // this.roomRateForm.get('pageName')?.setValue(this.dataArray.pageName)
        // this.roomRateForm.get('pageUrl')?.setValue(this.dataArray.pageUrl)
        // const selectedModule = this.moduleTypeOptions.find(module => module.moduleId === this.dataArray.moduleId);
        // if (selectedModule) {
        //   this.roomRateForm.get('moduleId')!.setValue(selectedModule.moduleId);
        //   this.roomRateForm.get('moduleName')!.setValue(selectedModule.moduleName);
        // }
      }

    })
  }
}
