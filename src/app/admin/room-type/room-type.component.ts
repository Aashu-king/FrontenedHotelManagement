import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-room-type',
  templateUrl: './room-type.component.html',
  styleUrl: './room-type.component.css'
})
export class RoomTypeComponent {
  roomTypeForm !: FormGroup;
  amenitiesList = ['WiFi', 'Air Conditioning', 'TV', 'Mini Bar'];
  outlets = [
    { id: 1, name: 'Outlet 1' },
    { id: 2, name: 'Outlet 2' }
  ];
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RoomTypeComponent>,private http: HttpClient) {}

  ngOnInit(): void {
    this.roomTypeForm = this.fb.group({
      roomTypeId: [''],
      typeName: ['', Validators.required],
      description: [''],
      baseRate: ['', [Validators.required, Validators.min(0)]],
      maxOccupancy: ['', [Validators.required, Validators.min(1)]],
      amenities: [[]],
      outletid: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.roomTypeForm.valid) {
      console.log(this.roomTypeForm.value);
      this.http.post('http://localhost:3000/api/v1/roomType', this.roomTypeForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
