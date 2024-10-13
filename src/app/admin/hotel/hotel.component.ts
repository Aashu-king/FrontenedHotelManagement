import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  dataArray : any
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<HotelComponent>,private http: HttpClient,private router : Router,@Inject(MAT_DIALOG_DATA) public data: any,) {}

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
    if(this.data && this.data.hotelid){
      console.log("🚀 ~ ModuleComponent ~ ngOnInit ~ this.data:", this.data)
      this.getByIdData();
    }
    this.pageurl =  this.router.url.split('/')[2]
    console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl:", this.pageurl)
    // console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl.split('/'):", this.pageurl.split('/'))

    this.http.get('http://localhost:3000/api/v1/getPerm').subscribe((result : any) => {
      this.permissionArray = result.Permissions.find((ele : any) => ele.page.pageUrl == `/${this.pageurl}`)
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.permissionArray)
    })
  }

  getByIdData(){
    const params = new HttpParams()
    .set('hotelid', this.data.hotelid)
    this.http.get(`http://localhost:3000/api/v1/get-hotel`,{params}).subscribe((result : any) => {
      this.dataArray = result
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
   
      if(this.dataArray){

        this.hotelForm.get('name')?.setValue(this.dataArray.name)
        this.hotelForm.get('address')?.setValue(this.dataArray.address)
        this.hotelForm.get('city')?.setValue(this.dataArray.city)
        this.hotelForm.get('state')?.setValue(this.dataArray.state)
        this.hotelForm.get('zipCode')?.setValue(this.dataArray.zipCode)
        this.hotelForm.get('phoneNumber')?.setValue(this.dataArray.phoneNumber)
        this.hotelForm.get('email')?.setValue(this.dataArray.email)
        this.hotelForm.get('rating')?.setValue(this.dataArray.rating)
        this.hotelForm.get('totalRooms')?.setValue(this.dataArray.totalRooms)
        this.hotelForm.get('isActive')?.setValue(this.dataArray.isActive)
        this.hotelForm.get('website')?.setValue(this.dataArray.website)
      }

    })
  }

  onSubmit() {
    if(!this.data) {
      if (this.hotelForm.valid) {
        console.log(this.hotelForm.value);
        this.http.post('http://localhost:3000/api/v1/hotels', this.hotelForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    } else{
      if (this.hotelForm.valid) {
        console.log(this.hotelForm.value);
        console.log("🚀 ~ ModuleComponent ~ onSubmit ~ this.data:", this.data)
        this.http.put(`http://localhost:3000/api/v1/hotel/${this.data}`, this.hotelForm.value).subscribe(
          (response: any) => {
            console.log('Success!', response);
            this.dialogRef.close(true); 
          }
        );
      }
    }
 
  }

  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1/hotel/${this.data}`).subscribe(
      (response: any) => {
        console.log('Success!', response);
        this.dialogRef.close(true); 
      }
    );
  }
}
