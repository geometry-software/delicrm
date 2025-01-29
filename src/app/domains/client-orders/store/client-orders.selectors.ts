import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from './client-orders.state'
import { ClientOrdersConstants } from '../models/client-orders.constants'

const storeFeatureKey = ClientOrdersConstants.storeFeatureKey
const paginationTitle = ClientOrdersConstants.paginationTitle
const paginationSize = ClientOrdersConstants.paginationSize

export const getState = createFeatureSelector<State>(storeFeatureKey)
export const getItems = createSelector(getState, (state) => state.items.data)
export const getSize = createSelector(getState, (state) => state.size)
export const getItemById = (id: string) => createSelector(getItems, (items) => items.find(el => el.id === id))
export const getItem = createSelector(getState, (state) => state.item.data)
export const getPaginationItem = createSelector(getItems, (state) => ({
  first: state?.length ? [...state][0] : null,
  last: state?.length ? [...state].pop() : null,
}))
export const getLoadingStatus = createSelector(getState, (state) => state.itemsLoadingStatus)
export const getTotal = createSelector(getState, (state) => state.items.total)
export const getCurrent = createSelector(getState, (state) => state.items.current)
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
