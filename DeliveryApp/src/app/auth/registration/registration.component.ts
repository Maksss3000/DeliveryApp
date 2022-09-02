import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from '../../../environments/environment';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { EmptyStringValidator } from '../../validators/emptyStringValidator';
import { Request } from '../request';
import { ResponseResult } from '../responseResult';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  //the view title
  title?: string = "Registration";

  //the form model
  form!: FormGroup;

  regReq!: Request;

  success: boolean = false;

  constructor(private http: HttpClient) {
    
  }

  ngOnInit(): void {

    this.form = new FormGroup({

      nickName: new FormControl('', [Validators.required, EmptyStringValidator.emptyString]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/)]),
      fullName: new FormControl('', [Validators.required, EmptyStringValidator.emptyString, Validators.minLength(3)]),
      address: new FormControl('', [Validators.required, EmptyStringValidator.emptyString, Validators.minLength(8), Validators.maxLength(50)]),
      phone: new FormControl('', [Validators.required,Validators.pattern("^[0-9]*$"), Validators.minLength(5), Validators.maxLength(10)])

    })

    this.regReq = <Request>{};
  }

  onSubmit() {
    
    this.regReq.nickName = this.form.controls['nickName'].value;
    this.regReq.password = this.form.controls['password'].value;
    this.regReq.fullName = this.form.controls['fullName'].value;
    this.regReq.address = this.form.controls['address'].value;
    this.regReq.phone = this.form.controls['phone'].value;
    
   // this.regReq = this.form.getRawValue();
    //console.log(this.regReq);
  
    this.http.post<ResponseResult>(environment.baseUrl + '/Account/registration', this.regReq).subscribe(result => {

      console.log(result);
    }, error => {
      console.log(error);
    });
    
   
  }
}