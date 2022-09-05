import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
//import { AuthService } from './auth.service';

//This class will be used as DI.
//In Backend API we have [Authorized] attribute , to prevent from unauthorized user access to
//specific actions.
//In this class we checking if user is authorized, and setting in header Bearer token.
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //get the auth token
    var token = localStorage.getItem("token");

    //if the token is present,clone the request
    //replacing the original headers with the authorization

    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    //send the request to the next handler
    return next.handle(req).pipe(catchError((error) => {
      //Perform logout on 401 -Unauthorized HTTP response errors
      if (error instanceof HttpErrorResponse && error.status === 401) {
        localStorage.clear();
        this.router.navigate(['login']);
      }
      return throwError(error);
    })
    );
  }

}
