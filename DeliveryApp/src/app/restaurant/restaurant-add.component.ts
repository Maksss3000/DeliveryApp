import { Component, OnInit} from '@angular/core';
import { Category } from '../categories/category';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { EmptyStringValidator } from '../validators/EmptyStringValidator';
import { Restaurant } from '../restaurants/restaurant';
import { NgxImageCompressService } from 'ngx-image-compress';


@Component({
  selector: 'app-restaurant-add',
  templateUrl: './restaurant-add.component.html',
  styleUrls: ['./restaurant-add.component.scss']
})
export class RestaurantAddComponent implements OnInit {

  //the view title
  title?: string;

  categories!: Category[];

  //the form model
  form!: FormGroup;

  //restaurant!: Restaurant;

  ownerName!: string;

  uploadFile!: File;

  compressedImg!: File;

  localUrl!: string;
  localCompressedURl!: string;

  constructor(private http: HttpClient, private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {

    this.title="Create"
    this.ownerName = "Maksimilian";
   
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2), EmptyStringValidator.emptyString]),
      category: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      owner: new FormControl(this.ownerName, Validators.required)
    });

    this.loadCategories();

  }


  loadCategories() {

    var params = new HttpParams().set("noImages", true);
    
    this.http.get<Category[]>(environment.baseUrl + '/Delivery/categories', { params }).subscribe(result => {
      this.categories = result
    }, error => console.error(error))
  }

  upload(files: FileList) {
 
    if (files.length > 0) {
      this.uploadFile = files[0];

      //Compressing File that user choosed.
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
        this.compressFile(this.localUrl, this.uploadFile.name);
      }
      reader.readAsDataURL(this.uploadFile);
    }
      
    if (files.length === 0)
      return;
  }

  compressFile(image: string, fileName: string) {

    var orientation = -1;
    //ratio x% , quality x%
    this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
        this.localCompressedURl = result;
        // create file from byte
        const imageName = fileName;

        // call method that creates a Blob from dataUri
        const imageBlob = this.dataURItoBlob(result.split(',')[1]);

        //the new compressed file
        this.compressedImg = new File([imageBlob], imageName, {type:'image/jpeg'});
    
        console.log("CompressedImg in Method", this.compressedImg);

      });
  }

  //creating Blob
  dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
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
   
    this.http.post(environment.baseUrl + '/Delivery/editRest', formData, { reportProgress: true }).subscribe(result => {
      //console.log(result);
    });
  }
}
