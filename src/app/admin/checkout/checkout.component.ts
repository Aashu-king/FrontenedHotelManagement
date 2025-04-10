import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  checkOutForm!: FormGroup;
  permissionArray : any 
  pageurl : any;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<CheckoutComponent>,private http: HttpClient,private router : Router) {}

  ngOnInit(): void {
    this.checkOutForm = this.fb.group({
      checkOutId: [{ value: '', disabled: true }],
      checkInId: ['', [Validators.required]],
      checkOutTime: ['', [Validators.required]],
      finalBillAmount: ['', [Validators.required, Validators.min(0)]],
      paymentStatus: ['', [Validators.required]],
      outletid: ['', [Validators.required]],
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
    if (this.checkOutForm.valid) {
      console.log(this.checkOutForm.value);
      this.http.post('http://localhost:3000/api/v1/hotels', this.checkOutForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
