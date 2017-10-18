import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];
  public _id: number;

  constructor(_id: number, name: string, desc: string, imagePath: string, ingredients: Ingredient[]) {
    this._id = _id;
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }
}
