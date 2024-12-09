import { createReducer, on } from '@ngrx/store'
import { Recipe } from '../models/recipe.model'
import { RecipeActions as ItemActions } from './recipe.actions'
import { RepositoryRequesEntity, RepositoryResponseList } from '../../../shared/repository/repository.model'
import { formatPaginationData } from '../../../shared/repository/repository.utils'
import { initialState, State } from './recipe.state'

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.getItems, (state) => ({
    ...state,
    items: {
      data: state.items?.data,
      total: state.items?.total,
      current: state.items?.current,
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
  on(ItemActions.getItemsSuccess, (state, { items, total, query, size }) => {
    const { responseTotal, current } = formatPaginationData(query, state, items.length, total, size ?? state.items?.size)
    return {
      ...state,
      listResponseType: query,
      items: {
        data: items,
        total: responseTotal,
        current: current,
        size: size ?? state.items.size,
        error: null,
      },
      resetRequest: false,
      itemId: null,
    }
  }),
  on(ItemActions.getItem, (state, { id }) => ({
    ...state,
    itemId: id,
    item: {
      data: null,
    },
  })),
  on(ItemActions.createItemFormInit, (state) => ({
    ...state,
    item: {
      data: {},
    },
  })),
  on(ItemActions.createItem, (state) => ({
    ...state,
    item: {
      data: state.item?.data,
    },
  })),
  on(ItemActions.updateItem, (state) => ({
    ...state,
    item: {
      data: state.item?.data,
    },
  })),
  on(ItemActions.resetRequestToTheFirstPage, (state) => ({
    ...state,
    resetRequest: true,
  }))
)