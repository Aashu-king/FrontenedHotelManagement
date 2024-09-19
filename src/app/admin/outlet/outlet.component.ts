import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrl: './outlet.component.css'
})
export class OutletComponent {
  outletForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<OutletComponent>, private http: HttpClient) {}

  ngOnInit(): void {
    this.outletForm = this.fb.group({
      outletid: [{ value: '', disabled: true }], 
      name: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      state: ['', [Validators.required, Validators.maxLength(100)]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]], 
      phoneNumber: ['', [Validators.pattern('[0-9]{10,20}')]], 
      email: ['', [Validators.email]], 
      hotelId: [''] 
    });
  }

  onSubmit() {
    if (this.outletForm.valid) {
      console.log(this.outletForm.value);
      this.http.post('http://localhost:3000/api/v1/outlet', this.outletForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
