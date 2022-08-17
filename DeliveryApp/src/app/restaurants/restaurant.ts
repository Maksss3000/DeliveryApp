import { Category } from '../categories/category';

export interface Restaurant {
  id: number
  name: string
  raiting: number
  votes: number
  image: string
  category: Category
  categoryId: number
  stars: number
}
