import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css'
})
export class HotelComponent {
  hotelForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.hotelForm = this.fb.group({
      hotelid: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      state: ['', [Validators.required, Validators.maxLength(100)]],
      zipCode: ['', [Validators.required, Validators.maxLength(10)]],
      phoneNumber: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(255)]],
      rating: ['', [Validators.min(0), Validators.max(5)]],
      totalRooms: ['', Validators.min(1)],
      isActive: [true],
      website: ['', Validators.maxLength(100)],
    });
  }

  onSubmit() {
    if (this.hotelForm.valid) {
      console.log(this.hotelForm.value);
    }
  }
}
