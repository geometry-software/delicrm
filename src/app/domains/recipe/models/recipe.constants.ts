import { RepositoryRequest } from '../../../shared/repository/repository.models'
import { Recipe, RecipeStatus } from './recipe.model'

export abstract class RecipeConstants {
  static readonly storeFeatureKey = 'RECIPES'
  static readonly collectionName = 'Recipes'
  static readonly defaultCreateStatus = 'active'
  static readonly defaultTableSort = 'createdAt'
  static readonly defaultSearchKey = 'name'
  static readonly paginationTitle = 'recipes'
  static readonly paginationSize = [5, 10, 20, 50]
  static readonly moduleUrl = '/recipes'
  static readonly tableColumns = ['name', 'type']
  static readonly disableSort = false
  static readonly searchPlaceholder = 'RECIPES.LIST.TABLE.SEARCH'
  static readonly createNotificationTitle = 'RECIPES.ACTION.CREATE'
  static readonly updateNotificationTitle = 'RECIPES.ACTION.UPDATE'
  static readonly deleteNotificationTitle = 'RECIPES.ACTION.DELETE'
  static readonly deleteConfirmationTitle = 'RECIPES.DELETE.TITLE'
  static readonly deleteConfirmationSubtitle = 'RECIPES.DELETE.SUBTITLE'
  static readonly backToListButton = 'RECIPES.NAVBAR'
  static readonly defaultRequestStatus = 'active'
  static readonly defaultPageRequest: RepositoryRequest<Recipe, RecipeStatus> = {
    pagination: {
      query: 'first',
      item: null,
    },
    sort: { active: 'createdAt', direction: 'desc' },
    size: 10,
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
