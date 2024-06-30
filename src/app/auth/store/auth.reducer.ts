import { createReducer, on } from '@ngrx/store'
import { AuthActions as ItemActions } from './auth.actions'
import { RepositoryRequesEntity, RepositoryResponseList } from 'src/app/shared/repository/repository.model'
import { formatPaginationData } from 'src/app/shared/repository/repository.utils'
import { AuthStatus, AuthStatusTotalResponse, AuthUser } from '../utils/auth.model'

export interface State {
  item: RepositoryRequesEntity<AuthUser>
  itemId: string
  items: RepositoryResponseList<AuthUser>
  listResponseType: any
  resetRequest: boolean
  requestStatus: AuthStatus
  listLabelAmount: AuthStatusTotalResponse
  isStatusUpdated: boolean
}

const initialState: State = {
  item: {
    loading: false,
  },
  itemId: null,
  items: {
    data: null,
    loading: false,
    total: null,
    current: null,
    size: null,
    error: null,
  },
  listResponseType: null,
  resetRequest: null,
  listLabelAmount: {
    requested: 0,
    client: 0,
    employee: 0,
    blocked: 0,
  },
  isStatusUpdated: null,
  requestStatus: null,
}

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.getItems, (state) => ({
    ...state,
    items: {
      data: null,
      loading: true,
      total: state.items?.total,
      current: state.items?.data?.length,
      size: state.items?.size,
      error: null,
    },
  })),
  on(ItemActions.getItemsBySearchQuery, (state) => ({
    ...state,
    items: {
      loading: true,
      data: state.items?.data,
      total: state.items?.total,
      current: state.items?.data?.length,
      size: state.items?.size,
      error: null,
    },
  })),
  on(ItemActions.getItemsSuccess, (state, { items, total, query, size, listLabelAmount }) => {
    const { responseTotal, current } = formatPaginationData(query, state, items.length, total, size ?? state.items?.size)
    return {
      ...state,
      listResponseType: query,
      items: {
        data: items,
        total: responseTotal,
        current: current,
        size: size ?? state.items.size,
        loading: false,
        error: null,
      },
      listLabelAmount,
      resetRequest: false,
      itemId: null,
    }
  }),
  on(ItemActions.getUsersTotalAmount, (state) => ({
    ...state,
    items: {
      data: null,
      loading: true,
      total: state.items?.total,
      current: state.items?.data?.length,
      size: state.items?.size,
      error: null,
    },
  })),
  on(ItemActions.updateUserStatus, (state) => ({
    ...state,
    isStatusUpdated: false,
  })),
  on(ItemActions.updateUserStatusSuccess, (state) => ({
    ...state,
    isStatusUpdated: true,
  })),
  on(ItemActions.getUsersTotalAmountSuccess, (state, { response }) => ({
    ...state,
    items: {
      loading: false,
      data: state.items?.data,
      total: state.items?.total,
      current: state.items?.data?.length,
      size: state.items?.size,
      error: null,
    },
    listLabelAmount: response,
  })),
  on(ItemActions.getItem, (state, { id }) => ({
    ...state,
    itemId: id,
    item: {
      data: null,
      loading: true,
    },
  })),
  on(ItemActions.getItemSuccess, (state, { item }) => ({
    ...state,
    item: {
      data: item,
      loading: false,
    },
  })),
  on(ItemActions.createItem, (state) => ({
    ...state,
    item: {
      data: state.item?.data,
      loading: true,
    },
  })),
  on(ItemActions.updateItem, (state) => ({
    ...state,
    item: {
      data: state.item?.data,
      loading: true,
    },
  })),
  on(ItemActions.resetRequestToTheFirstPage, (state) => ({
    ...state,
    resetRequest: true,
  }))
)
