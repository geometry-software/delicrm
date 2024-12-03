import { PaginationRequest } from '../../../shared/models/pagination.model'
import { RepositoryRequest, RepositoryRequestOrder, SizeRequest } from '../../../shared/repository/repository.model'
import { Recipe, RecipeStatus } from './recipe.model'
import { Sort } from '@angular/material/sort'

export abstract class RecipeConstants {
  static readonly storeFeatureKey = 'RECIPES'
  static readonly collectionName = 'Recipes'
  static readonly defaultCreateStatus = 'active'
  static readonly defaultTableSort = 'timestamp'
  static readonly defaultSearchKey = 'name'
  static readonly paginationTitle = 'recipes'
  static readonly paginationSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  static readonly moduleUrl = '/recipes'
  static readonly tableColumns = ['name', 'type', 'price']
  static readonly disableSort = false
  static readonly searchPlaceholder = 'RECIPES.PAGE.LIST.TABLE.SEARCH'
  static readonly deleteTitle = 'RECIPES.PAGE.DETAIL.DELETE_TITLE'
  static readonly backToListButton = 'RECIPES.NAVBAR'
  static readonly defaultPaginationControlValue: PaginationRequest<Recipe> = {
    query: 'first',
    item: null,
  }
  static readonly defaultSizeControlValue: SizeRequest = {
    size: 10,
  }
  static readonly defaultOrderControlValue: Sort = {
    active: 'timestamp',
    direction: 'desc',
  }
  static readonly defaultRequestStatus = 'active'
  static readonly defaultFirstPageRequest: RepositoryRequest<Recipe, RecipeStatus> = {
    pagination: this.defaultPaginationControlValue,
    order: {
      key: this.defaultOrderControlValue.active,
      value: this.defaultOrderControlValue.direction as RepositoryRequestOrder,
    },
    size: this.defaultSizeControlValue,
    status: this.defaultRequestStatus,
  }
}

export enum PLATE_TYPE_TRANSLATE {
  main = 'MISC.PLATE_TYPE.MAIN',
  starter = 'MISC.PLATE_TYPE.STARTER',
  drink = 'MISC.PLATE_TYPE.DRINK',
  salad = 'MISC.PLATE_TYPE.SALAD',
  rice = 'MISC.PLATE_TYPE.RICE',
  garnish = 'MISC.PLATE_TYPE.GARNISH',
  dessert = 'MISC.PLATE_TYPE.DESSERT',
  alacarte = 'MISC.PLATE_TYPE.ALACARTE',
}

export enum PLATE_PROTEIN_TRANSLATE {
  meat = 'MISC.PROTEIN_TYPE.MEAT',
  chicken = 'MISC.PROTEIN_TYPE.CHICKEN',
  fish = 'MISC.PROTEIN_TYPE.FISH',
  veg = 'MISC.PROTEIN_TYPE.VEG',
}
