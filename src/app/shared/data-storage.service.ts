import { Injectable } from "@angular/core";
import { Http, RequestOptions } from "@angular/http";
import { RecipeService } from "app/recipes/recipe.service";
import { Response } from '@angular/http';
import { Recipe } from '../recipes/recipe.model';
import 'rxjs';

@Injectable()
export class DataStorageService {
    constructor(private http: Http, private recipeService: RecipeService) {}

    storeRecipes() {

        return this.http.put('http://localhost:3000/api/recipes', this.recipeService.getRecipes());
    }

    getRecipes() {
        this.http.get('http://localhost:3000/api/recipes')
        .map(
            (response: Response) => {
                const recipes: Recipe[] = response.json();
                for (let recipe of recipes) {
                    if(!recipe['ingredients']) {
                        recipe['ingredients'] = [];
                    }
                }
                return recipes;
            }
        )   
        .subscribe(
            (recipes: Recipe[]) => {
                this.recipeService.setRecipes(recipes);
            }
        )
    }
}   