import { createFeatureSelector, createSelector } from '@ngrx/store'
import { UserConstants } from '../utils/user.constants'
import { State } from './user.state'

const storeFeatureKey: string = UserConstants.storeFeatureKey
const paginationTitle: string = UserConstants.paginationTitle
const paginationSize: Array<number> = UserConstants.paginationSize

const labelRequested: string = UserConstants.labelRequested
const labelConfirmed: string = UserConstants.labelConfirmed
const labelBlocked: string = UserConstants.labelBlocked

export const getState = createFeatureSelector<State>(storeFeatureKey)
export const getItems = createSelector(getState, (state) => state.items?.data)
export const getRequestStatus = createSelector(getState, (state) => state.requestStatus)
export const getItemsData = createSelector(getItems, getRequestStatus, (items, status) => ({
  data: items,
  status,
}))
export const getItemsPageAmount = createSelector(getState, (state) => state.items?.data?.length)
export const getResetRequestToTheFirstPage = createSelector(getState, (state) => state.resetRequest)
// export const getItem = createSelector(getState, (state) => state.item?.data)
export const getItem = (id: string) => createSelector(getItems, (items) => items.find(el => {
  const user = el as any
  return user.id === id
  // el.auth.authId === id
}))
export const getItemId = createSelector(getState, (state) => state.itemId)
export const getPaginationItem = createSelector(getItems, (state) => ({
  first: state?.length ? [...state][0] : null,
  last: state?.length ? [...state].pop() : null,
}))
export const getItemsLoadingStatus = createSelector(getState, (state) => state.itemsLoadingStatus)
export const getItemLoadedState = createSelector(getState, (state) => state.item.data)
export const getLayoutLoading = createSelector(getItemsLoadingStatus, getItemsLoadingStatus, (item, items) => item || items)
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
export const getListLabelAmount = createSelector(getState, (state) => state.listLabelAmount)
export const getListLabels = createSelector(getListLabelAmount, (state) => ({
  requested: labelRequested + ' (' + state.requested + ')',
  confirmed: labelConfirmed + ' (' + state.confirmed + ')',
  blocked: labelBlocked + ' (' + state.blocked + ')',
}))
export const isStatusUpdated = createSelector(getState, (state) => state.isStatusUpdated)
