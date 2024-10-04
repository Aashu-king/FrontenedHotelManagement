import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.css'
})
export class GuestComponent {
  guestForm !: FormGroup;
  idTypes = ['Passport', 'Driver\'s License', 'National ID'];
  outlets = [
    { id: 1, name: 'Outlet 1' },
    { id: 2, name: 'Outlet 2' }
  ];
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<GuestComponent>,private http: HttpClient) {}

  ngOnInit(): void {
    this.guestForm = this.fb.group({
      guestId: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      identificationType: ['', Validators.required],
      identificationNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      outletid: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.guestForm.valid) {
      console.log(this.guestForm.value);
      this.http.post('http://localhost:3000/api/v1/guest', this.guestForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
