import { Component, OnInit } from '@angular/core';
import { Product } from './product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from "@angular/router";
import { ProductService } from './product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute,
              private prodServ: ProductService) { }

  restId?: number;
  products!: Product[];
  env = environment;
  restName?: string;
  noData: boolean = false;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {

    var id = this.activatedRoute.snapshot.paramMap.get('id');
    this.restId = id ? +id : 0;

    this.prodServ.loadRestaurantProducts(this.restId).subscribe(result => {
      if (result.length == 0) {
        this.noData = true;
      }
      else {
        result.map(res => {
          res.image = this.env.imgUrl + '/Products/' + res.image;
        })
        this.restName = result[0].restaurantName;
        this.products = result;
        console.log("Res", result);
      }
    }, error => console.error(error));

  }
}


