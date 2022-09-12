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
import { RestaurantService } from './restaurant.service';

@Component({
  selector: 'app-restaurant-add',
  templateUrl: './restaurant-add.component.html',
  styleUrls: ['./restaurant-add.component.scss']
})
export class RestaurantAddComponent extends BaseFormComponent implements OnInit  {

  //the view title
  title?: string = "Create";

  //the restaurant object id,as fetched from the active route:
  //It`s NULL when we`are adding a new resturant,
  //and not NULL when we are editing an existing one.
  id?: number;

  categories!: Category[];

  restaurant?: Restaurant;

  ownerName?: string|null;

  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute,
              imageCompress: NgxImageCompressService,
              private router: Router,
              private restServ: RestaurantService) {
    super(imageCompress);
  }

  ngOnInit(): void {

    //will get this name from localStorage
    this.ownerName = localStorage.getItem("owner");
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, EmptyStringValidator.emptyString]),
      category: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
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
      this.restServ.getRestaurant(this.id).subscribe(result => {
        this.restaurant = result;

        if (this.restaurant) {
          this.title = "Edit";

          //If User is NOT owner of the specific restaurant
          //Redirecting him to another route.(Forbidden/your Restaurants..)
          if (this.restaurant.owner != this.ownerName) {
            this.router.navigate(['/panel']);
          }
          

          //Setting to our form values from API.
          this.form.patchValue({
            name: result.name,
            category: result.categoryId,
          });
        }
        else {
          this.router.navigate(['/panel']);
        }
      
      }, error => console.log(error));

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
    formData.append('image', this.uploadFile.name);

    //Edit Restaurants
    if (this.id) {
      var params = new HttpParams().set("id", this.id).set("securityId", this.id);
      
      this.restServ.editRestaurant(formData, params).subscribe(result => {
        this.redirect("panel");
      }, error => {
        if (error.status == 403) {
          localStorage.clear();
          this.router.navigate(['/login']);
         // this.message = error.error.message;
          //this.error = true;
        }
      });
    }

    //Add Restaurant
    else {
      this.restServ.addRestaurant(formData).subscribe(result => {
        this.redirect("panel");
      }, error => console.error(error));
    }
   
  }

  redirect(path:string) {
    this.success = true;
    setTimeout(() => {
        this.router.navigate(['/' + path]);
    }, 2000); 
  }

}
