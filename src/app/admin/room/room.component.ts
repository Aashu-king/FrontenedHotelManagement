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
  roomTypes : any
  outlets : any
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RoomComponent>,private http: HttpClient) {}

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      roomId: [''],
      roomNumber: [''],
      roomTypeId: [''],
      floor: [''],
      status: ['available'],
      outletid: ['']
    });
    this.getDropdown()
  }

  getDropdown(){
    console.log('yooo');
    
    this.http.get('http://localhost:3000/api/v1/dropdown-outlets').subscribe(
      (response : any) => {
        console.log('Success!', response);
        this.outlets = response
      }
    );
    this.http.get('http://localhost:3000/api/v1/dropdown-room-types').subscribe(
      (response : any) => {
        console.log('Success!', response);
        this.roomTypes = response
      }
    );
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
