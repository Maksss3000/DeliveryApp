import { Component, OnInit} from '@angular/core';
import { Category } from '../categories/category';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from '../../environments/environment';

import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { EmptyStringValidator } from '../validators/emptyStringValidator';
import { Restaurant} from '../restaurants/restaurant';
import { NgxImageCompressService } from 'ngx-image-compress';
import { BaseFormComponent } from '../base-form.component';

@Component({
  selector: 'app-restaurant-add',
  templateUrl: './restaurant-add.component.html',
  styleUrls: ['./restaurant-add.component.scss']
})
export class RestaurantAddComponent extends BaseFormComponent implements OnInit  {

  //the view title
  title?: string="Create";

   //the restaurant object id,as fetched from the active route:
  //It`s NULL when we`are adding a new resturant,
  //and not NULL when we are editing an existing one.
  id?: number;

  categories!: Category[];

  //the form model
  //form!: FormGroup;

  restaurant?: Restaurant;

  ownerName!: string;

  //uploadFile!: File;

  //compressedImg!: File;

  //localUrl!: string;
  //localCompressedURl!: string;

  constructor(private http: HttpClient,
    private activatedRoute: ActivatedRoute, imageCompress: NgxImageCompressService) {
    super(imageCompress);
  }

  ngOnInit(): void {

    //will get this name from IdentityContext(user name).
    this.ownerName = "maksss3000";
   
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2), EmptyStringValidator.emptyString]),
      category: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      owner: new FormControl(this.ownerName, Validators.required)
    });

    this.loadCategories();
    this.checkMode();
  }

  //Edit or Add Mode.
  checkMode() {
    //retrieve the ID from the 'id' parameter
    //that was passed by url ,if we want to edit restaurant.
    var idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    //Edit Mode
    if (this.id) {
      //Getting specific Restaurant
      this.http.get<Restaurant>(environment.baseUrl + '/Delivery/restaurant/'+this.id).subscribe(result => {
        this.restaurant = result;

        if (this.restaurant) {
          this.title = "Edit";
          console.log(this.restaurant);
          //If User is NOT owner of the specific restaurant
          //Redirecting him to another route.(Forbidden/your Restaurants..)
          /*
          if (this.restaurant.owner != this.ownerName) {
            //Redirect.
          }
          */

          //Setting to our form values from API.
          this.form.patchValue({
            name: result.name,
            category: result.categoryId,
            owner: result.owner
          });
        }
        else {
          console.log("Redirect , because we don`t have this restaurant in DB");
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
  loadCategories() {

    var params = new HttpParams().set("noImages", true);
    
    this.http.get<Category[]>(environment.baseUrl + '/Delivery/categories', { params }).subscribe(result => {
      this.categories = result
    }, error => console.error(error))
  }
  
  onSubmit() {
   
    const formData = new FormData();

    formData.append('imageFile', this.compressedImg);
    formData.append('name', this.form.controls['name'].value);
    formData.append('categoryId', this.form.controls['category'].value);
    formData.append('owner', this.ownerName);
    formData.append('image', this.uploadFile.name);

    /*
    console.log("Not Compressed Upload File", this.uploadFile);
    console.log("Compressed", this.compressedImg);
    */

    //Edit Restaurants
    if (this.id) {
      var params = new HttpParams().set("id", this.id);
      this.http.put<Restaurant>(environment.baseUrl + '/Delivery/editRest', formData, { params }).subscribe(result => {
        console.log(result);
      }, error => console.error(error));
    }
    //Add Restaurant
    else {
      this.http.post<Restaurant>(environment.baseUrl + '/Delivery/addRest', formData).subscribe(result => {
        console.log(result);
      }, error => console.error(error));
    }
   
  }
}