import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from '../../../environments/environment';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { EmptyStringValidator } from '../../validators/emptyStringValidator';
import { Request } from '../request';
import { ResponseResult } from '../responseResult';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //the view title
  title?: string = "Log-In";

  //the form model
  form!: FormGroup;

  logReq!: Request;

  success: boolean = false;
  error: boolean = false;

  message: string = "";

  returnUrl: string = "/";

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute,private route :Router) { }

  ngOnInit(): void {

    //If user trying to get permission to some route and
    //after authentication redirecting to this route.
    //Or redirecting to base route.
    var redirectionUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl');
    this.returnUrl = redirectionUrl ? redirectionUrl : "/";

    this.form = new FormGroup({

      nickName: new FormControl('', [Validators.required, EmptyStringValidator.emptyString]),
      password: new FormControl('', Validators.required),
    })

    this.logReq = <Request>{};
  }

  onSubmit() {
   // this.logReq = <Request>{};
    this.logReq.nickName = this.form.controls['nickName'].value;
    this.logReq.password = this.form.controls['password'].value;
    
    
    this.http.post<ResponseResult>(environment.baseUrl + '/Account/login', this.logReq).subscribe(result => {
      this.message = result.message;
      this.error = false;
      this.success = true;
      localStorage.setItem("token", result.token);
      localStorage.setItem("owner", result.owner);
       
      setTimeout(() => {
        this.route.navigate([this.returnUrl]);
      }, 2000); 
      
    }, error => {

      if (error.status == 401) {
        this.message = error.error.message;
        this.error = true;
      }
    })
    
  }

  logout() {
    localStorage.clear();
  }
}
