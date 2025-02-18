import { createFeatureSelector, createSelector } from '@ngrx/store'
import { ClientConstants } from '../models/client.constants'
import { State } from './client.state'

const storeFeatureKey = ClientConstants.storeFeatureKey
const paginationTitle = ClientConstants.paginationTitle
const paginationSize = ClientConstants.paginationSize

const labelAuth = ClientConstants.labelAuth
const labelActive = ClientConstants.labelActive
const labelBlocked = ClientConstants.labelBlocked

export const getState = createFeatureSelector<State>(storeFeatureKey)
export const getItems = createSelector(getState, (state) => state.items.data)
export const getSize = createSelector(getState, (state) => state.size)
export const getDeliveries = createSelector(getState, (state) => state.deliveries)
export const getItemId = createSelector(getState, (state) => state.itemId)
export const getPaginationItem = createSelector(getItems, (state) => ({
  first: state?.length ? [...state][0] : null,
  last: state?.length ? [...state].pop() : null,
}))
export const getLoadingStatus = createSelector(getState, (state) => state.loadingStatus)
export const getTotal = createSelector(getState, (state) => state.items.total)
export const getCurrent = createSelector(getState, (state) => state.items.current)
export const getStatus = createSelector(getState, (state) => state.status)
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
export const itemsAmountByStatus = createSelector(getState, (state) => state.itemsAmountByStatus)
export const getListLabels = createSelector(itemsAmountByStatus, (status) => ({
  auth: { title: labelAuth, amount: status.auth },
  active: { title: labelActive, amount: status.active },
  blocked: { title: labelBlocked, amount: status.blocked }
}))