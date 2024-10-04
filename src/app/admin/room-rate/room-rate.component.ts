import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

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
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RoomRateComponent>,private http: HttpClient) {}

  ngOnInit(): void {
    this.roomRateForm = this.fb.group({
      rateId: [''],
      roomTypeId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      ratePerNight: ['', [Validators.required, Validators.min(0)]],
      outletid: ['', Validators.required]
    });
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
  }
}
