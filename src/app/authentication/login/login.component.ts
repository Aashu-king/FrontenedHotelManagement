import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface LoginResponse {
  businessID: string;
  isAdmin: boolean;
  token: string;
  userId: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
   
  loginForm: FormGroup;
  recoverPasswordForm:  FormGroup;
  isRecovering: boolean = false;

  constructor(private fb: FormBuilder, private http : HttpClient,private router : Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.recoverPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  onSubmitLogin(value : any) {
    console.log('value: ', value);
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.http.post('http://localhost:3000/api/v1/login', value).subscribe(
        (response : any) => {
          console.log('Success!', response);
          // localStorage.setItem('email', response.email);
          localStorage.setItem('token', response.token);
          // localStorage.setItem('userid', response.userid);
          this.router.navigate(['admin/hotel']);
        }
      );
    }
  }



  toggleRecoverPassword() {
    this.isRecovering = !this.isRecovering;
  }
}
