import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token')
    console.log("🚀 ~ TokenInterceptorService ~ intercept ~ token:", token)

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` 
        }
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
