import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  roleForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  permissionArray : any 
  pageurl : any;
  dataArray : any
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RoleComponent>, private http: HttpClient, private router: Router,@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      roleId: [{ value: '', disabled: true }],
      roleName: ['', [Validators.required, Validators.maxLength(100)]],
    });
    if(this.data){
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
    this.http.get(`http://localhost:3000/api/v1/role/${this.data}`).subscribe((result : any) => {
      this.dataArray = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
   

    })
  }

  onSubmit() {
    if(!this.data) {
      if (this.roleForm.valid) {
        console.log(this.roleForm.value);
        this.http.post('http://localhost:3000/api/v1/role', this.roleForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    } else {
      if (this.roleForm.valid) {
        console.log(this.roleForm.value);
        console.log("🚀 ~ ModuleComponent ~ onSubmit ~ this.data:", this.data)
        this.http.put(`http://localhost:3000/api/v1/role/${this.data}`, this.roleForm.value).subscribe(
          (response: any) => {
            console.log('Success!', response);
            this.dialogRef.close(true); 
          }
        );
      }
    }
   
  }

  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1/role/${this.data}`).subscribe(
      (response: any) => {
        console.log('Success!', response);
        this.dialogRef.close(true); 
      }
    );
  }
}
