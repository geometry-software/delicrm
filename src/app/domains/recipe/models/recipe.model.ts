import { RepositoryEntityStatus } from "../../../shared/repository/repository.models";

export interface Recipe {
  createdAt?: number;
  name?: string;
  history?: string;
  price?: number;
  // TODO: add an option to calculate and show value for the client
  nutritionalValue?: NutritionalValue;
  type?: RecipeType;
  protein?: RecipeProtein;
  imgURL?: string;
  id?: string;
  status?: RecipeStatus;
}

export interface NutritionalValue {
  calories?: number;
  fat?: number;
  protein?: number;
  carbohydrates?: number;
}

export type RecipeStatus = RepositoryEntityStatus;

export type RecipeType =
  | 'main'
  | 'starter'
  | 'drink'
  | 'side'
  | 'dessert'
  | 'alacarte'

export type RecipeProtein = 'meat' | 'chicken' | 'fish' | 'veg'
