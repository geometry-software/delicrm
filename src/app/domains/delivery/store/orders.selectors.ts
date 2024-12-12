import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from './orders.state'
import { DeliveryConstants } from '../models/delivery.constants'

const storeFeatureKey = DeliveryConstants.storeFeatureKey
const paginationTitle = DeliveryConstants.paginationTitle
const paginationSize = DeliveryConstants.paginationSize
const labelCooking = DeliveryConstants.labelCooking
const labelDelivery = DeliveryConstants.labelDelivery
const labelPaid = DeliveryConstants.labelPaid
const labelCanceled = DeliveryConstants.labelCanceled

export const getState = createFeatureSelector<State>(storeFeatureKey)
export const getItems = createSelector(getState, (state) => state.items.data)
export const getRequestStatus = createSelector(getState, (state) => state.requestStatus)
export const getItemsData = createSelector(getItems, getRequestStatus, (items, status) => ({
  data: items,
  status,
}))
export const getItemsPageAmount = createSelector(getState, (state) => state.items.data.length)
export const getResetRequestToTheFirstPage = createSelector(getState, (state) => state.resetRequest)
export const getItem = (id: string) => createSelector(getItems, (items) => items.find(el => el.id === id))
export const getItemId = createSelector(getState, (state) => state.itemId)
export const getPaginationItem = createSelector(getItems, (state) => ({
  first: state?.length ? [...state][0] : null,
  last: state?.length ? [...state].pop() : null,
}))
export const getItemsLoadingStatus = createSelector(getState, (state) => state.itemsLoadingStatus)
export const getItemLoadedState = createSelector(getState, (state) => state.item.data)
export const getLayoutLoading = createSelector(getItemsLoadingStatus, getItemsLoadingStatus, (item, items) => item || items)
export const getTotal = createSelector(getState, (state) => state.items.total)
export const getCurrent = createSelector(getState, (state) => state.items.current)
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
export const itemAmountByStatus = createSelector(getState, (state) => state.itemAmountByStatus)
export const getListLabels = createSelector(itemAmountByStatus, (state) => ({
  cooking: labelCooking + ' (' + state.cooking + ')',
  delivery: labelDelivery + ' (' + state.delivery + ')',
  paid: labelPaid + ' (' + state.paid + ')',
  canceled: labelCanceled + ' (' + state.canceled + ')',
}))
export const isStatusUpdated = createSelector(getState, (state) => state.isStatusUpdated)
