import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from './recipe.reducer'
import { RecipeConstants } from '../utils/recipe.constants'

const storeFeatureKey: string = RecipeConstants.storeFeatureKey
const paginationTitle: string = RecipeConstants.paginationTitle
const paginationSize: Array<number> = RecipeConstants.paginationSize

export const getState = createFeatureSelector<State>(storeFeatureKey)
export const getItems = createSelector(getState, (state) => state.items.data)
export const getItemsPageAmount = createSelector(getState, (state) => state.items.data.length)
export const getResetRequestToTheFirstPage = createSelector(getState, (state) => state.resetRequest)
export const getItem = createSelector(getState, (state) => state.item.data)
export const getItemId = createSelector(getState, (state) => state.itemId)
export const getPaginationItem = createSelector(getItems, (state) => ({
  first: state?.length ? [...state][0] : null,
  last: state?.length ? [...state].pop() : null,
}))
export const getItemLoadingState = createSelector(getState, (state) => state.item.loading)
export const getItemsLoadingState = createSelector(getState, (state) => state.items.loading)
export const getLayoutLoading = createSelector(getItemLoadingState, getItemsLoadingState, (item, items) => item || items)
export const getTotal = createSelector(getState, (state) => state.items.total)
export const getCurrent = createSelector(getState, (state) => state.items?.current)
export const getListResponseType = createSelector(getState, (state) => state.listResponseType)
export const getPaginationResponse = createSelector(getPaginationItem, getCurrent, getTotal, (item, current, total) => ({
  item: {
    first: item.first,
    last: item.last,
  },
  options: {
    current: current,
    total: total,
    title: paginationTitle,
    sizeList: paginationSize,
  },
}))
