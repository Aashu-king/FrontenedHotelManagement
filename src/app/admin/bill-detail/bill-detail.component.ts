import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
SaveUpdateEvent: any;
  
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<BillDetailComponent>,private http: HttpClient,private router : Router,@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.billDetailForm = this.fb.group({
      billDetailId: [],
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

    if(this.data.id){
      console.log("🚀 ~ BillDetailComponent ~ ngOnInit ~ this.data.id:", this.data.id)
      this.getPaymentData();
    }
  }

  onSubmit() {
    if(this.data.paymentStatus == ''){
      if(!this.data){
        if (this.billDetailForm.valid) {
          console.log(this.billDetailForm.value);
          this.http.post('http://localhost:3000/api/v1/bill-detail', this.billDetailForm.value).subscribe(
            (response : any) => {
              console.log('Success!', response);
            }
          );
        }
      }else{
        if (this.billDetailForm.valid) {
          console.log(this.billDetailForm.value);
          this.http.put(`http://localhost:3000/api/v1/bill-detail/${this.data.id}`, this.billDetailForm.value).subscribe(
            (response : any) => {
              console.log('Success!', response);
            }
          );
        }
      }
     
    }else{
      if (this.billDetailForm.valid) {
        console.log(this.billDetailForm.value);
        this.http.post('http://localhost:3000/api/v1/bill-detail', this.billDetailForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }
  
  }

  getPaymentData(){
  
    if(this.data.paymentStatus != ''){
      console.log("🚀 ~ BillDetailComponent ~ getPaymentData ~ this.data:", this.data)
      this.billDetailForm.get('amount')?.setValue(this.data.paymentStatus.AmountTobePaidMore)
      this.billDetailForm.get('outletid')?.setValue(this.data.paymentStatus.outletid)
      this.billDetailForm.get('billId')?.setValue(this.data.paymentStatus.billId)
    }else{
      this.http.get(`http://localhost:3000/api/v1/bill-detail/${this.data.id}`, this.billDetailForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
       
      
   
  }

  onDelete(){

  }
}
