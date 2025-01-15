import { Recipe } from '../models/recipe.model'
import { RepositoryRequesEntity, RepositoryRequestListQuery, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'

export interface State {
  query: RepositoryRequestListQuery,
  items: RepositoryResponseList<Recipe>
  item: RepositoryRequesEntity<Recipe>
  itemId: string
  loadingStatus: LoadingStatus
  listResponseType: any
  resetRequest: boolean
  size: number
}

export const initialState: State = {
  query: 'first',
  item: {
    data: null,
  },
  itemId: null,
  items: {
    data: [],
    total: 0,
    current: 0,
  },
  loadingStatus: LoadingStatus.NotLoaded,
  listResponseType: null,
  resetRequest: null,
  size: null
}
