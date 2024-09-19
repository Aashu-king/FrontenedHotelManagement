import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrl: './user-permission.component.css'
})
export class UserPermissionComponent {
  userPermissionForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<UserPermissionComponent>, private http: HttpClient) {}

  ngOnInit(): void {
    this.userPermissionForm = this.fb.group({
      userId: [''],
      pageId: [''],
      canView: [false],
      canEdit: [false],
      canDelete: [false],
    });
  }

  onSubmit() {
    if (this.userPermissionForm.valid) {
      console.log(this.userPermissionForm.value);
      this.http.post('http://localhost:3000/api/v1/userwisePermission', this.userPermissionForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
