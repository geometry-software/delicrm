import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from './orders.state'
import { OrderConstants } from '../models/order.constants'

const storeFeatureKey = OrderConstants.storeFeatureKey
const paginationTitle = OrderConstants.paginationTitle
const paginationSize = OrderConstants.paginationSize
const labelCooking = OrderConstants.labelCooking
const labelDelivery = OrderConstants.labelDelivery
const labelPaid = OrderConstants.labelPaid
const labelCanceled = OrderConstants.labelCanceled

export const getState = createFeatureSelector<State>(storeFeatureKey)
export const getItems = createSelector(getState, (state) => state.items.data)
export const getSize = createSelector(getState, (state) => state.size)
export const getItemsPageAmount = createSelector(getState, (state) => state.items.data.length)
// export const getResetRequestToTheFirstPage = createSelector(getState, (state) => state.resetRequest)
export const getItem = (id: string) => createSelector(getItems, (items) => items.find(el => el.id === id))
export const getItemId = createSelector(getState, (state) => state.itemId)
export const getPaginationItem = createSelector(getItems, (state) => ({
  first: state?.length ? [...state][0] : null,
  last: state?.length ? [...state].pop() : null,
}))
export const getLoadingStatus = createSelector(getState, (state) => state.itemsLoadingStatus)
export const getTotal = createSelector(getState, (state) => state.items.total)
export const getCurrent = createSelector(getState, (state) => state.items.current)
export const getStatus = createSelector(getState, (state) => state.status)
export const getQuery = createSelector(getState, (state) => state.query)
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
  cooking: labelCooking + ' (' + status.cooking + ')',
  delivery: labelDelivery + ' (' + status.delivery + ')',
  paid: labelPaid + ' (' + status.paid + ')',
  canceled: labelCanceled + ' (' + status.canceled + ')',
}))