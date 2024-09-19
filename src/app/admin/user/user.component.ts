import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  userForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<UserComponent>, private http: HttpClient) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      userId: [{ value: '', disabled: true }], 
      userName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      passwordHash: ['', [Validators.required, Validators.maxLength(255)]],
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
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      this.http.post('http://localhost:3000/api/v1/user', this.userForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
