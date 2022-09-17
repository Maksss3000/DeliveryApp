import { Category } from '../categories/category';

export interface Restaurant {
  id: number
  name: string
  raiting: number
  votes: number
  image: string
  category: Category
  categoryId: number
  stars: number;
  owner: string
}
/*
export interface RestaurantDTO {
  id: number
  name: string
  raiting: number
  votes: number
  image: string
  category: Category
  categoryId: number
  stars: number
  owner:string
}
*/
/*
 *  imageFile: string
  image: string
  name: string
  raiting: number
  votes: number
  owner: string
  category: Category
  categoryId: number
 */
