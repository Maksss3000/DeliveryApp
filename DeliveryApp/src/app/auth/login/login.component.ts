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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

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
      this.success = true;
      this.error = false;
      this.message = result.message;

    }, error => {

      if (error.status == 401) {
        this.error = true;
        this.message = error.error.message;
      }
    })

  }

}
