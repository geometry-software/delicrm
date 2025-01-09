import { RepositoryRequest } from "../../../shared/repository/repository.models"
import { ShiftStatus, Shift } from "./shift"

export abstract class ShiftConstants {
  static readonly collectionName = 'Shifts'
  static readonly storeFeatureKey = 'SHIFTS'
  static readonly defaultCreateStatus = 'active'
  static readonly defaultTableSort = 'createdAt'
  static readonly defaultSearchKey = 'name'
  static readonly paginationTitle = 'orders'
  static readonly labelRequested = 'Requested'
  static readonly labelConfirmed = 'Confirmed'
  static readonly labelCanceled = 'Canceled'
  static readonly paginationSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20]
  static readonly moduleUrl = '/orders'
  static readonly tableColumns = ['date', 'plates', 'total']
  static readonly statusList: ShiftStatus[] = ['active']
  static readonly disableSort = true
  static readonly searchPlaceholder = 'RECIPES.PAGE.LIST.TABLE.SEARCH'
  static readonly deleteTitle = 'RECIPES.PAGE.DETAIL.DELETE_TITLE'
  static readonly backToListButton = 'RECIPES.NAVBAR'
  static readonly defaultPageRequest: RepositoryRequest<Shift, ShiftStatus> = {
    pagination: {
      query: 'first',
      item: null,
    },
    sort: { active: 'createdAt', direction: 'desc' },
    size: 10,
    status: 'active',
  }
}