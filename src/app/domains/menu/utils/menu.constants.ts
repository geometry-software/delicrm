import { Sort } from '@angular/material/sort'
import { Recipe, RecipeStatus } from '../../recipe/models/recipe.model'
import { PaginationRequest } from '../../../shared/models/pagination.model'
import { RepositoryRequest, RepositoryRequestOrder, SizeRequest } from '../../../shared/repository/repository.model'

export abstract class MenuConstants {
  static readonly storeFeatureKey = 'MENU'
  static readonly collectionName = 'Orders'
  static readonly collectionNameDelivery = 'Deliveries'
  static readonly alaCarteLabel = 'A la Carte'
  static readonly dailyMenuLabel = 'Daily Menu'
  static readonly checkOutUrl = '/menu/checkout'
  static readonly ordersUrl = '/orders'
}