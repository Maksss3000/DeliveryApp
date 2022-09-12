import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseResult } from './responseResult';
import { Request } from './request';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  constructor(private http: HttpClient) {
  }

  ragistration(regReq:Request): Observable<ResponseResult>{
    return this.http.post<ResponseResult>(environment.baseUrl + '/Account/registration', regReq);
  }
  logIn(logReq: Request): Observable<ResponseResult>{

    return this.http.post<ResponseResult>(environment.baseUrl + '/Account/login', logReq);
  }

  initLocalStorage(token:string,owner:string,fullName:string) {
    localStorage.setItem("token", token);
    localStorage.setItem("owner", owner);
    localStorage.setItem("name", fullName);
  }
  logout() {
    localStorage.clear();
  
  }
}
