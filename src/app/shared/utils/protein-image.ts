import { RecipeProtein } from "../../domains/recipe/models/recipe.model"

export const setProteinImage = (protein: RecipeProtein) => '/assets/images/' + protein + '.png'