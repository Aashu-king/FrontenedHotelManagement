import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
  dataArray : any;
  permissionArray : any 
  pageurl : any;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<GuestComponent>,private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: any,private router: Router) {}

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

    this.pageurl =  this.router.url.split('/')[2]
    console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl:", this.pageurl)
    // console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl.split('/'):", this.pageurl.split('/'))

    this.http.get('http://localhost:3000/api/v1/getPerm').subscribe((result : any) => {
      this.permissionArray = result.Permissions.find((ele : any) => ele.page.pageUrl == `/${this.pageurl}`)
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.permissionArray)
    })

    if(this.data){
      console.log("🚀 ~ ModuleComponent ~ ngOnInit ~ this.data:", this.data)
      this.getByIdData();
    }
  }

  getByIdData(){
    this.http.get(`http://localhost:3000/api/v1/guest/${this.data}`).subscribe((result : any) => {
      this.dataArray = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
      if(this.dataArray){
        this.guestForm.get('moduleTypeName')?.setValue(this.dataArray.moduleTypeName)
      }

    })
  }

  onSubmit() {
    if(!this.data) {
      if (this.guestForm.valid) {
        console.log(this.guestForm.value);
        this.http.post('http://localhost:3000/api/v1/guest', this.guestForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    } else {
      if (this.guestForm.valid) {
        console.log(this.guestForm.value);
        this.http.put(`http://localhost:3000/api/v1/guest/${this.data}`, this.guestForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }
 
  }

  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1/guest/${this.data}`).subscribe(
      (response: any) => {
        console.log('Success!', response);
        this.dialogRef.close(true); 
      },
      (error) => {
        console.error('Error saving module:', error);
      }
    );
  }
}
