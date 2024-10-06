import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css'
})
export class HotelComponent {
  hotelForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  pageurl : any;
  justHotelData : any[] = []
  permissionArray : any 
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<HotelComponent>,private http: HttpClient,private router : Router) {}

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

    this.pageurl =  this.router.url.split('/')[2]
    console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl:", this.pageurl)
    // console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl.split('/'):", this.pageurl.split('/'))

    this.http.get('http://localhost:3000/api/v1/getPerm').subscribe((result : any) => {
      this.permissionArray = result.Permissions.find((ele : any) => ele.page.pageUrl == `/${this.pageurl}`)
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.permissionArray)
    })
  }

  onSubmit() {
    if (this.hotelForm.valid) {
      console.log(this.hotelForm.value);
      this.http.post('http://localhost:3000/api/v1/hotels', this.hotelForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
