
import { PaginationRequest } from '../../../shared/models/pagination.model'
import { RepositoryRequest } from '../../../shared/repository/repository.models'

export abstract class RestaurantConstants {
  static readonly collectionName = 'Restaurant'
  static readonly defaultCurrency = '$'
  static readonly infoDocument = 'info'
  static readonly menuDocument = 'menu'
  static readonly startersAmount = 3
  static readonly drinksAmount = 2
}