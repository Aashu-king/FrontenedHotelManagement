import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  roleForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RoleComponent>, private http: HttpClient) {}

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      roleId: [{ value: '', disabled: true }],
      roleName: ['', [Validators.required, Validators.maxLength(100)]],
    });
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
