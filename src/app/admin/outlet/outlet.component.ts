import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrl: './outlet.component.css'
})
export class OutletComponent {
  outletForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  permissionArray : any 
  pageurl : any;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<OutletComponent>, private http: HttpClient, private router: Router) {}

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

    this.pageurl =  this.router.url.split('/')[2]
    console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl:", this.pageurl)
    // console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl.split('/'):", this.pageurl.split('/'))

    this.http.get('http://localhost:3000/api/v1/getPerm').subscribe((result : any) => {
      this.permissionArray = result.Permissions.find((ele : any) => ele.page.pageUrl == `/${this.pageurl}`)
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.permissionArray)
    })
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
