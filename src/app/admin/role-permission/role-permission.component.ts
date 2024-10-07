import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrl: './role-permission.component.css'
})
export class RolePermissionComponent {
  rolePermissionForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  permissionArray : any 
  pageurl : any;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RolePermissionComponent>, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.rolePermissionForm = this.fb.group({
      roleId: [''],
      pageId: [''],
      canView: [false],
      canEdit: [false],
      canDelete: [false],
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
    if (this.rolePermissionForm.valid) {
      console.log(this.rolePermissionForm.value);
      this.http.post('http://localhost:3000/api/v1/rolewisePermission', this.rolePermissionForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
