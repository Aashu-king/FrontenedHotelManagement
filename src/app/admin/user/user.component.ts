import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  userForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  dataArray : any
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<UserComponent>, private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: any,) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      userId: [{ value: ''}], 
      userName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.maxLength(255)]],
      roleId: ['', Validators.required],
      outletId: ['', Validators.required],
      phoneNumber: [''],
      address: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      dateOfBirth: [''],
      isActive: [true],
      isAdmin: [false],
    });

    if(this.data){
      console.log("🚀 ~ ModuleComponent ~ ngOnInit ~ this.data:", this.data)
      this.getByIdData();
    }
  }

  getByIdData(){
    this.http.get(`http://localhost:3000/api/v1/user/${this.data}`).subscribe((result : any) => {
      this.dataArray = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
   

    })
  }

  onSubmit() {
    if(!this.data) {
      if (this.userForm.valid) {
        console.log(this.userForm.value);
        this.http.post('http://localhost:3000/api/v1/user', this.userForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    } else {
      if (this.userForm.valid) {
        console.log(this.userForm.value);
        console.log("🚀 ~ ModuleComponent ~ onSubmit ~ this.data:", this.data)
        this.http.put(`http://localhost:3000/api/v1/user/${this.data}`, this.userForm.value).subscribe(
          (response: any) => {
            console.log('Success!', response);
            this.dialogRef.close(true); 
          }
        );
      }
    }

  }

  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1/user/${this.data}`).subscribe(
      (response: any) => {
        console.log('Success!', response);
        this.dialogRef.close(true); 
      }
    );
  }
}
