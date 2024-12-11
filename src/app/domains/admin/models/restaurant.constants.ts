import { Sort } from '@angular/material/sort'
import { PaginationRequest } from '../../../shared/models/pagination.model'
import { RepositoryRequest, RepositoryRequestOrder, SizeRequest } from '../../../shared/repository/repository.model'

export abstract class RestaurantConstants {
  static readonly collectionName = 'Restaurant'
  static readonly defaultCurrency = '$'
  static readonly infoDocument = 'info'
  static readonly menuDocument = 'menu'
  static readonly startersAmount = 3
  static readonly drinksAmount = 2
}