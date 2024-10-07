import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrl: './bill-detail.component.css'
})
export class BillDetailComponent {
  billDetailForm!: FormGroup;
  permissionArray : any 
  pageurl : any;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<BillDetailComponent>,private http: HttpClient,private router : Router) {}

  ngOnInit(): void {
    this.billDetailForm = this.fb.group({
      billDetailId: [{ value: '', disabled: true }],
      billId: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      amount: ['', [Validators.required, Validators.min(0)]],
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
    if (this.billDetailForm.valid) {
      console.log(this.billDetailForm.value);
      this.http.post('http://localhost:3000/api/v1/hotels', this.billDetailForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
