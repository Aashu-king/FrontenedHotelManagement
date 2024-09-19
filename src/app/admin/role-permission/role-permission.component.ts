import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrl: './role-permission.component.css'
})
export class RolePermissionComponent {
  rolePermissionForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RolePermissionComponent>, private http: HttpClient) {}

  ngOnInit(): void {
    this.rolePermissionForm = this.fb.group({
      roleId: [''],
      pageId: [''],
      canView: [false],
      canEdit: [false],
      canDelete: [false],
    });
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
