import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent {
  roomForm !: FormGroup;
  roomTypes = [
    { id: 1, name: 'Single' },
    { id: 2, name: 'Double' }
   
  ];
  outlets = [
    { id: 1, name: 'Outlet 1' },
    { id: 2, name: 'Outlet 2' }
    
  ];
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RoomComponent>,private http: HttpClient) {}

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      roomId: [''],
      roomNumber: ['', Validators.required],
      roomTypeId: ['', Validators.required],
      floor: ['', Validators.required],
      status: ['available', Validators.required],
      outletid: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.roomForm.valid) {
      console.log(this.roomForm.value);
      this.http.post('http://localhost:3000/api/v1/room', this.roomForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
