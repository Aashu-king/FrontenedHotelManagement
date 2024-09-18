import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder,private http: HttpClient) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],        
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      gender: [''],
      phoneNumber: [''],
      street: [''],
      area: [''],
      locality: [''],
      state: [''],
      country: [''],
      isBuniessUser: [false, Validators.required]
    });
  }

  onSubmit(value: any) {
    console.log('value: ', value);
    if (this.registerForm.valid) {

      // Send the form data as JSON
      this.http.post('http://localhost:3000/ecomm/user', value).subscribe(
        response => {
          console.log('Success!', response);
        },
        error => {
          console.error('Error!', error);
        }
      );
    }
  }
}
