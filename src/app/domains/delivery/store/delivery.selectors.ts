import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from './delivery.state'
import { DeliveryConstants } from '../models/delivery.constants'

const storeFeatureKey = DeliveryConstants.storeFeatureKey
const paginationTitle = DeliveryConstants.paginationTitle
const paginationSize = DeliveryConstants.paginationSize
const labelRequested = DeliveryConstants.labelRequested
const labelConfirmed = DeliveryConstants.labelConfirmed
const labelCanceled = DeliveryConstants.labelCanceled

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
  requested: labelRequested + ' (' + status.requested + ')',
  confirmed: labelConfirmed + ' (' + status.confirmed + ')',
  canceled: labelCanceled + ' (' + status.canceled + ')',
}))