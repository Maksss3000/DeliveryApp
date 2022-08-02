import { Component, HostBinding, OnInit } from '@angular/core';
import { Category } from './category';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

export class CategoriesComponent implements OnInit {
 // @HostBinding("style.--img") imgSt: string = "";
  //myImg: string = "";

  //Not null.
  public categories!: Category[];
  public env = environment;

  constructor(private http: HttpClient) {
   
}

  ngOnInit(): void {

    this.http.get<Category[]>(environment.baseUrl + '/Delivery/categories').subscribe(result => {
      result.map(res => {
        res.img = `${this.env.imgUrl}/${res.img}`;
      })
      this.categories = result;
    }, error => console.error(error));
  }



}
