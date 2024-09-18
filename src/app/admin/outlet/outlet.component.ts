import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrl: './outlet.component.css'
})
export class OutletComponent {
  outletForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

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
   
    }
  }
}
