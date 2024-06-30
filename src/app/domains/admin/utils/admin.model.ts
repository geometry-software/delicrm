import { RepositoryEntityStatus } from 'src/app/shared/repository/repository.model'

export interface Recipe {
  timestamp?: Date
  name?: string
  history?: string
  price?: number
  // TODO: add an option to calculate and show value for the client
  nutritionalValue?: NutritionalValue
  type?: RecipeCourse
  protein?: RecipeProtein
  imgURL?: string
  id?: string
  status?: RecipeStatus
}

export interface NutritionalValue {
  calories?: number
  fat?: number
  protein?: number
  carbohydrates?: number
}

export type RecipeStatus = RepositoryEntityStatus

export type RecipeCourse = 'main' | 'starter' | 'drink' | 'salad' | 'rice' | 'garnish' | 'dessert' | 'extra'

export type RecipeProtein = 'beef' | 'chicken' | 'pork' | 'fish' | 'veg'
