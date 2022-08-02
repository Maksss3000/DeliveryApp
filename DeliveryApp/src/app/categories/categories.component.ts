import { Component, HostBinding, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Category } from './category';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  //@Input() val: string = "burger.jpg";
  @Input() val: string = "burger.jpg";
  @HostBinding("style.--img") myImg: string = `url('../../assets/logos/${this.val}')`;
  //Not null.
  public categories!: Category[];
  public env = environment;

  constructor(private http: HttpClient) {
    //   this.imgUr = "url('../../assets/logos/burger.jpg')";
   
}

  ngOnInit(): void {

    this.http.get<Category[]>(environment.baseUrl + '/Delivery').subscribe(result => {
      this.categories = result;
    }, error => console.error(error));
    /*
    this.http.get<City[]>(environment.baseUrl + 'api/Cities').subscribe(result => {
      this.cities = new MatTableDataSource<City>(result);
      this.cities.paginator = this.paginator;
    }, error => console.error(error));
    */

   // this.imgUr = "url('../../assets/logos/burger.jpg')";
  }

}
