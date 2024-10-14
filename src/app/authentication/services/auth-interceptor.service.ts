import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token')
    console.log("🚀 ~ TokenInterceptorService ~ intercept ~ token:", token)

    let authReq = req;

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` 
        }
      });
      return next.handle(authReq);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('token'); 
          this.router.navigate(['auth/login']); 
        }
        return throwError(error);
      })
    );
  }
}
