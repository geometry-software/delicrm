import { createReducer, on } from '@ngrx/store'
import { AuthActions as ItemActions } from './user.actions'
import { formatPaginationData } from '../../../shared/repository/repository.utils'
import { State, initialState } from './user.state'
import { LoadingStatus } from '../../../shared/models/loading-status'

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.getItems, (state) => ({
    ...state,
    itemsLoadingStatus: LoadingStatus.Loading,
    items: {
      data: null,
      total: state.items?.total,
      current: state.items?.data?.length,
      size: state.items?.size,
      error: null,
    },
  })),
  on(ItemActions.getItemsBySearchQuery, (state) => ({
    ...state,
    items: {
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
      itemsLoadingStatus: LoadingStatus.LoadingSuccess,
      listResponseType: query,
      items: {
        data: items,
        total: responseTotal,
        current: current,
        size: size ?? state.items.size,
        error: null,
      },
      listLabelAmount,
      resetRequest: false,
      itemId: null,
    }
  }),
  // on(ItemActions.getUsersTotalAmount, (state) => ({
  //   ...state,
  //   items: {
  //     data: null,
  //     loading: true,
  //     total: state.items?.total,
  //     current: state.items?.data?.length,
  //     size: state.items?.size,
  //     error: null,
  //   },
  // })),
  // on(ItemActions.updateUserStatus, (state) => ({
  //   ...state,
  //   isStatusUpdated: false,
  // })),
  // on(ItemActions.updateUserStatusSuccess, (state) => ({
  //   ...state,
  //   isStatusUpdated: true,
  // })),
  // on(ItemActions.getUsersTotalAmountSuccess, (state, { response }) => ({
  //   ...state,
  //   items: {
  //     loading: false,
  //     data: state.items?.data,
  //     total: state.items?.total,
  //     current: state.items?.data?.length,
  //     size: state.items?.size,
  //     error: null,
  //   },
  //   listLabelAmount: response,
  // })),
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
