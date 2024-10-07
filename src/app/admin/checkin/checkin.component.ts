import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.css'
})
export class CheckinComponent {
  checkInForm!: FormGroup;

  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<CheckinComponent>,private http: HttpClient,private router : Router) {}

  ngOnInit(): void {
    this.checkInForm = this.fb.group({
      checkInId: [{ value: '', disabled: true }],
      reservationId: ['', [Validators.required]],
      checkInTime: ['', [Validators.required]],
      assignedRoomId: ['', [Validators.required]],
      additionalRequests: [''],
      outletid: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.checkInForm.valid) {
      console.log(this.checkInForm.value);
      this.http.post('http://localhost:3000/api/v1/hotels', this.checkInForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
