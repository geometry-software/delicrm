import { createReducer, on } from '@ngrx/store'
import { RecipeActions as ItemActions } from './recipe.actions'
import { initialState, State } from './recipe.state'

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.createItemFormInit, (state) => ({
    ...state,
    item: {
      data: null,
    },
  })),
  on(ItemActions.getItemsSuccess, (state, { items, size }) => ({
    ...state,
    items,
    size
  })),
  on(ItemActions.setItemsLoadingStatus, (state, { status }) => ({
    ...state,
    loadingStatus: status
  })),
  on(ItemActions.getItem, (state) => ({
    ...state,
    item: {
      data: null,
    },
  })),
  on(ItemActions.getItemSuccess, (state, { item }) => ({
    ...state,
    item: {
      data: item,
    },
  })),
  on(ItemActions.getItemsBySearchQuery, (state, { request }) => ({
    ...state,
    query: 'custom'
  })),
  on(ItemActions.getItems, (state, { request }) => ({
    ...state,
    query: request.pagination.query
  })),
  on(ItemActions.createItemSuccess, (state, { item }) => ({
    ...state,
    item: {
      data: item,
    },
  })),
)