import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from '../../environments/environment';

import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { EmptyStringValidator } from '../validators/emptyStringValidator';
import { Restaurant } from '../restaurants/restaurant';
import { NgxImageCompressService } from 'ngx-image-compress';
import { BaseFormComponent } from '../base-form.component';
import { Product } from './product';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})

export class ProductAddComponent extends BaseFormComponent implements OnInit {

  title?: string = "Create";

  id?: number;

  ownerName!: string|null;

  restaurants!: Restaurant[];

  product?: Product;

  securityId?: number;

  constructor(private http: HttpClient, imageCompress: NgxImageCompressService,
    private activatedRoute: ActivatedRoute, private router:Router) {
    super(imageCompress);
  }

  ngOnInit(): void {

    //Will get this name from localStorage.
    this.ownerName = localStorage.getItem("owner");

    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2), EmptyStringValidator.emptyString]),
      description: new FormControl('', [Validators.required, EmptyStringValidator.emptyString]),
      price: new FormControl('', [Validators.required, Validators.pattern(/^[]?[0-9]+(\.[0-9]{1,2})?$/), Validators.max(50000)]),
      restaurant: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required)
    });

    this.loadRestaurants();
    this.checkMode();
  }

  //Loade all Restaurants of this owner.
  loadRestaurants() {

    this.http.get<Restaurant[]>(environment.baseUrl + '/Delivery/ownerRestaurants').subscribe(result => {
      this.restaurants = result;
    }, error => console.error(error));
  }


  //Edit or Add Mode.
  checkMode() {
    //retrieve the ID from the 'id' parameter
    //that was passed by url ,if we want to edit product.
    var idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    //Edit Mode
    if (this.id) {
      //Getting specific Product
      this.http.get<Product>(environment.baseUrl + '/Delivery/product/' + this.id).subscribe(result => {
        this.product = result;
        this.securityId = result.restaurantId;
        if (this.product) {
          this.title = "Edit";
          //If User is NOT owner of this specific product
          //Redirecting him to another route.(Forbidden/your Restaurants..)

          if (this.product.owner != this.ownerName) {
            //Redirect.
            this.router.navigate(['/']);
          }
          

          //Setting to our form values from API.
          this.form.patchValue({
            name: result.name,
            description: result.description,
            price: result.price,
            restaurant: result.restaurantId
          });
        }
        else {
          console.log("Redirect , because we don`t have this product in DB");
        }

      }, error => console.log(error));

      //console.log("Restaurant 3",this.restaurant);
      //!! update the form with restaurant values
      //restaurant value properties have the same name
      //as FormControl input names
      //this.form.patchValue(this.restaurant!);
      // this.title = "Edit";
    }
  }

  
  onSubmit() {

    const formData = new FormData();

    formData.append('imageFile', this.compressedImg);
    formData.append('image', this.uploadFile.name);
    formData.append('name', this.form.controls['name'].value);
    formData.append('price', this.form.controls['price'].value);
    formData.append('description', this.form.controls['description'].value);
    formData.append('restaurantId', this.form.controls['restaurant'].value);

    //Edit Product
    if (this.id) {
      var params = new HttpParams().set("id", this.id).set("securityId", this.securityId!);

      this.http.put<Product>(environment.baseUrl + '/Delivery/editProd', formData, { params }).subscribe(result => {
        this.redirect(result);
      
      }, error => {
        if (error.status == 403) {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
    }
    //Add Product
    else {
      
      this.http.post<Product>(environment.baseUrl + '/Delivery/addProd', formData).subscribe(result => {
        this.redirect(result);
      }, error => console.error(error))
      
    }

  }

  redirect(result: Product) {
    this.success = true;
    setTimeout(() => {
      this.router.navigate(['/products', result.restaurantId]);
    }, 2000);
  }

}
