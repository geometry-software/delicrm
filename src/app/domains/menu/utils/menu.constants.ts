import { Sort } from '@angular/material/sort'
import { Recipe, RecipeStatus } from '../../recipe/models/recipe.model'
import { PaginationRequest } from '../../../shared/models/pagination.model'
import { RepositoryRequest, RepositoryRequestOrder, SizeRequest } from '../../../shared/repository/repository.model'

export abstract class MenuConstants {
  static readonly storeFeatureKey = 'ADMIN'
  static readonly collectionName = 'Recipes'
  static readonly alaCarteLabel = 'A la Carte'
  static readonly dailyMenuLabel = 'Daily Menu'
}

export enum STATUS_COLOR {
  cooking = '#f6d7b0',
  delivery = '#fcb1fe',
  paid = '#19b7c6',
  canceled = '#cf573cH',
}

export enum STATUS_ICON {
  cooking = 'skillet',
  delivery = 'directions_bike',
  paid = 'attach_money',
  canceled = 'delete_forever',
}
