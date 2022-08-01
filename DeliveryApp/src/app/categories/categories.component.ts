import { Component, HostBinding, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  @HostBinding("style.--img") imgUr: string = "";
  //@Input();
  myImg: string = "url('../../assets/logos/burger.jpg')";
  val: string = "burger.jpg";
  myImgs: string[] = [`url('../../assets/logos/${this.val}')`, `url('../../assets/logos/${this.val}')`];
  constructor() {
 //   this.imgUr = "url('../../assets/logos/burger.jpg')";
}

  ngOnInit(): void {
   // this.imgUr = "url('../../assets/logos/burger.jpg')";
  }

}
