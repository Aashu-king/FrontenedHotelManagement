import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RoleComponent>, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      roleId: [{ value: '', disabled: true }],
      roleName: ['', [Validators.required, Validators.maxLength(100)]],
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
    if (this.roleForm.valid) {
      console.log(this.roleForm.value);
      this.http.post('http://localhost:3000/api/v1/role', this.roleForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
